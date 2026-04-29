const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/gerar-pdf", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL não enviada");
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080
    });

    await page.goto(url, {
      waitUntil: "networkidle2"
    });

    await new Promise(r => setTimeout(r, 4000));

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rota.pdf"
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar PDF");
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
