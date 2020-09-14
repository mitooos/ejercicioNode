const http = require("http");
const url = require("url");
const fs = require("fs");
const axios = require("axios").default;

const urlProveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const urlClientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    let pathName = url.parse(req.url, true).pathname;
    try {
      if (pathName == "/api/proveedores") {
        await handleProveedores(req, res);
      } else if (pathName == "/api/clientes") {
        await handleClients(req, res);
      } else {
        await handleNotFound(req, res);
      }
    } catch (error) {
      console.log(error);
      res.writeHead(500, "Internal server error");
      res.write("500: Internal server error");
      res.end();
    }
  })
  .listen(8081);

const handleProveedores = async (req, res) => {
  let template = await getTemplate("./templates/proveedores.html").toString();
  let proveedores = await axios.get(urlProveedores);
  let renderedProveedores = renderProveedores(proveedores.data);
  template = template.replace("{{body}}", renderedProveedores);
  res.write(template);
  res.end();
};

const handleClients = async (req, res) => {
  let template = await getTemplate("./templates/clientes.html").toString();
  let clientes = await axios.get(urlClientes);
  let renderedClients = renderClients(clientes.data);
  template = template.replace("{{body}}", renderedClients);
  res.write(template);
  res.end();
};

const handleNotFound = async (req, res) => {
  let template = await getTemplate("./templates/notFound.html");
  res.write(template);
  res.end();
};

const renderProveedores = (proveedores) => {
  let ans = "";
  proveedores.forEach((proveedor) => {
    ans += renderTableRow(
      proveedor.idproveedor,
      proveedor.nombrecompania,
      proveedor.nombrecontacto
    );
  });
  return ans;
};

const renderClients = (clientes) => {
  let ans = "";
  clientes.forEach((cliente) => {
    ans += renderTableRow(
      cliente.idCliente,
      cliente.NombreCompania,
      cliente.NombreContacto
    );
  });
  return ans;
};

const renderTableRow = (col1, col2, col3) => {
  return `<tr>
    <td>${col1}</td>
    <td>${col2}</td>
    <td>${col3}</td>
    </tr>`;
};

const getTemplate = (path) => {
  return fs.readFileSync(path);
};
