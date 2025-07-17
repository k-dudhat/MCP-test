const express = require("express");
const PDFDocument = require("pdfkit");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const app = express();
app.use(express.json());

app.post("/generate-bar-chart", async (req, res) => {
  const { labels, data } = req.body;

  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Scores",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  const doc = new PDFDocument();
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.set("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  });

  doc.image(imageBuffer, 50, 50, { width: 500 });
  doc.end();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
