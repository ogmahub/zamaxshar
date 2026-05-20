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
  console.log("Super Admin tizimiga kirishga urinmoqdamiz...");
  
  let loginResult;
  let username = "ZAMAXSHAR12";
  let password = "zamaxshar";
  
  try {
    loginResult = await makeRequest(`${apiBase}/auth/admin/login`, "POST", { username, password });
  } catch (err) {
    console.error("Ulanishda xatolik:", err.message);
    setTimeout(run, 15000);
    return;
  }

  if (loginResult.statusCode !== 200) {
    username = "admin";
    password = "admin123";
    loginResult = await makeRequest(`${apiBase}/auth/admin/login`, "POST", { username, password });
  }

  if (loginResult.statusCode !== 200) {
    console.error("Xato: Login qilib bo'lmadi! 15 soniyadan keyin qayta urinamiz...", loginResult.body);
    setTimeout(run, 15000);
    return;
  }

  const setCookie = loginResult.headers["set-cookie"];
  if (!setCookie || setCookie.length === 0) {
    console.error("Xato: Cookie topilmadi!");
    setTimeout(run, 15000);
    return;
  }

  const cookie = setCookie.map(c => c.split(";")[0]).join("; ");

  console.log(`Login muvaffaqiyatli! Profil: ${username}. Ustozlarni o'chirishga so'rov yuborilmoqda...`);
  
  try {
    const clearResult = await makeRequest(`${apiBase}/teachers/clear`, "DELETE", null, {
      "Cookie": cookie
    });

    if (clearResult.statusCode === 200) {
      console.log("=========================================================");
      console.log("YASHASIN! BARCHA USTOZLAR BUTUNLAY O'CHIRILDI!");
      console.log("Xabar:", clearResult.body.message);
      console.log("=========================================================");
      process.exit(0);
    } else {
      console.log(`Server hali ham eski versiyada (Status: ${clearResult.statusCode}). Qayta urinamiz...`);
      setTimeout(run, 15000);
    }
  } catch (err) {
    console.error("So'rovda xatolik, 15 soniyadan keyin qayta urinamiz:", err.message);
    setTimeout(run, 15000);
  }
};

run();
