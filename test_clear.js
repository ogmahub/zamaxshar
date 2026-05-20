import http from "https";

const apiBase = "https://zamaxshar.onrender.com/api";

const makeRequest = (url, method, body, headers = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const run = async () => {
  console.log("1. Super Admin tizimiga login qilishga urinib ko'ramiz...");
  
  // Try ZAMAXSHAR12 first
  let loginResult;
  let username = "ZAMAXSHAR12";
  let password = "zamaxshar";
  
  try {
    loginResult = await makeRequest(`${apiBase}/auth/admin/login`, "POST", { username, password });
  } catch (err) {
    console.error("Ulanishda xatolik:", err.message);
    return;
  }

  if (loginResult.statusCode !== 200) {
    console.log(`ZAMAXSHAR12 hisobi o'xshmadi, 'admin' hisobini sinab ko'ramiz...`);
    username = "admin";
    password = "admin123";
    loginResult = await makeRequest(`${apiBase}/auth/admin/login`, "POST", { username, password });
  }

  if (loginResult.statusCode !== 200) {
    console.error("Xato: Super admin hisobiga login qilib bo'lmadi!", loginResult.body);
    return;
  }

  console.log(`Muvaffaqiyatli login qilindi! Profil: ${username}`);
  
  // Extract cookie
  const setCookie = loginResult.headers["set-cookie"];
  if (!setCookie || setCookie.length === 0) {
    console.error("Xato: Set-Cookie sarlavhasi topilmadi!");
    return;
  }

  const cookie = setCookie.map(c => c.split(";")[0]).join("; ");
  console.log("Cookie muvaffaqiyatli olindi.");

  console.log("2. Barcha 22 ta ustozni butunlay o'chirishga so'rov yuborilmoqda...");
  try {
    const clearResult = await makeRequest(`${apiBase}/teachers/clear`, "DELETE", null, {
      "Cookie": cookie
    });

    if (clearResult.statusCode === 200) {
      console.log("Yashasin! Barcha ustozlar va ularga tegishli ma'lumotlar muvaffaqiyatli o'chirildi!");
      console.log("Xabar:", clearResult.body.message);
    } else {
      console.error(`O'chirishda xatolik yuz berdi (Status: ${clearResult.statusCode}):`, clearResult.body);
    }
  } catch (err) {
    console.error("O'chirish so'rovida xatolik:", err.message);
  }
};

run();
