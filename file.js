const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const clients = [{ id: 1, taxNumber: '86620855', name: 'HECTOR ACUÑA BOLAÑOS'},
                { id: 2, taxNumber: '7317855K', name: 'JESUS RODRIGUEZ ALVAREZ'},
                { id: 3, taxNumber: '73826497', name: 'ANDRES NADAL MOLINA'},
                { id: 4, taxNumber: '88587715', name: 'SALVADOR ARNEDO MANRIQUEZ'},
                { id: 5, taxNumber: '94020190', name: 'VICTOR MANUEL ROJAS LUCAS'},
                { id: 6, taxNumber: '99804238', name: 'MOHAMED FERRE SAMPER' }];

const accounts = [{ clientId: 6, bankId: 1, balance: 15000 },
                  { clientId: 1, bankId: 3, balance: 18000 },
                  { clientId: 5, bankId: 3, balance: 135000 },
                  { clientId: 2, bankId: 2, balance: 5600 },
                  { clientId: 3, bankId: 1, balance: 23000 },
                  { clientId: 5, bankId: 2, balance: 15000 },
                  { clientId: 3, bankId: 3, balance: 45900 },
                  { clientId: 2, bankId: 3, balance: 19000 },
                  { clientId: 4, bankId: 3, balance: 51000 },
                  { clientId: 5, bankId: 1, balance: 89000 },
                  { clientId: 1, bankId: 2, balance: 1600 },
                  { clientId: 5, bankId: 3, balance: 37500 },
                  { clientId: 6, bankId: 1, balance: 19200 },
                  { clientId: 2, bankId: 3, balance: 10000 },
                  { clientId: 3, bankId: 2, balance: 5400 },
                  { clientId: 3, bankId: 1, balance: 9000 },
                  { clientId: 4, bankId: 3, balance: 13500 },
                  { clientId: 2, bankId: 1, balance: 38200 },
                  { clientId: 5, bankId: 2, balance: 17000 },
                  { clientId: 1, bankId: 3, balance: 1000 },
                  { clientId: 5, bankId: 2, balance: 600 },
                  { clientId: 6, bankId: 1, balance: 16200 },
                  { clientId: 2, bankId: 2, balance: 10000 }];

const banks = [{ id: 1, name: 'SANTANDER' },
              { id: 2, name: 'CHILE' },
              { id: 3, name: 'ESTADO' }];
// 0 Arreglo con los ids de clientes
function listClientsIds() {
  return clients.map((client) => client.id);
};
// 1 Arreglo con los ids de clientes ordenados por rut
function listClientsIdsSortByTaxNumber() {
  // Ordenado del rut menor al mayor con su id al lado
  return clients.map((client) => [client.taxNumber , client.id]).sort();
};
// 2 Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los bancos que participa.
function sortClientsTotalBalances() {
  results = []
   clients.map((client) => [client.id,client.name]).forEach(function (value) {
     var totalBalance = accounts.filter((account) => account.clientId ==  value[0])
     .map(balance_ => balance_.balance)
     .reduce((acc, score) => acc + score, 0);
     results.push({saldo: totalBalance, nombre:value[1]});
   });
    return results.sort((a, b) => b.saldo - a.saldo );
};
// 3 Objeto en que las claves sean los nombres de los bancos y los valores un arreglo con los ruts de sus clientes ordenados alfabeticamente por nombre.
function banksClientsTaxNumbers() {
  rut = [];
  var bankObj = new Object();
  banks.map((bank) => [bank.id,bank.name]).forEach(function (value) {
    var clientes = accounts.filter((account) => account.bankId ==  value[0])
    .map((client_) => client_.clientId);
    var clientesId = clientes.filter((i, index) => clientes.indexOf(i) === index);
    bankObj[value[1]] = clientesId;
    clientesId.forEach(function (value_) {
    var dataClients = clients.filter((client) => client.id ==  value_);
    rut.push({name : dataClients[0].name, rut:dataClients[0].taxNumber });
  });
  bankObj[value[1]] = rut.map(balance_ => [balance_.name, balance_.rut]).sort();
  rut = [];
  });
  return bankObj;

};
// 4 Arreglo ordenado decrecientemente con los saldos de clientes que tengan más de 25.000 en el Banco SANTANDER
function richClientsBalances() {
  return sortClientsTotalBalances().filter((account) => account.saldo > 25000).sort((a, b) => a.saldo - b.saldo )
};
// 5 Arreglo con ids de bancos ordenados crecientemente por la cantidad TOTAL de dinero queadministran.
function banksRankingByTotalBalance() {
  results = []
  banks.map((bank) => bank.id).forEach(function (value) {
    var totalBalance = accounts.filter((account) => account.bankId ==  value)
    .map(balance_ => balance_.balance)
    .reduce((acc, score) => acc + score, 0);
    results.push({id_banco: value, saldo: totalBalance });
  });
   return results.sort((a, b) => a.saldo - b.saldo );
};
// 6 Objeto en que las claves sean los nombres de los bancos y los valores el número de clientes que solo tengan cuentas en ese banco.
function banksFidelity() {
  var bankObj = new Object();
    banks.map((bank) => [bank.id,bank.name]).forEach(function (value) {
      var clients = accounts.filter((account) => account.bankId ==  value[0])
      .map((client_) => client_.clientId);
      var clientsId = clients.filter((i, index) => clients.indexOf(i) === index);
      bankObj[value[1]] = clientsId.length;
    });
    return bankObj;
};
// 7 Objeto en que las claves sean los nombres de los bancos y los valores el id de su clientecon menos dinero.
function banksPoorClients() {
  results = []
  var bankObj = new Object();
  var clientObj = new Object();
    banks.map((bank) => [bank.id,bank.name]).forEach(function (value) {
      var clients = accounts.filter((account) => account.bankId ==  value[0])
      .map((client_) => client_.clientId);
      var clientsId = clients.filter((i, index) => clients.indexOf(i) === index);
      bankObj[value[1]] = {id: clientsId, bank :value[0]} ;
      clientsId.forEach(function (val) {
        total = accounts.filter((account) => account.bankId == value[0] )
        .filter((account) => account.clientId == val )
        .map(balance_ => balance_.balance)
        .reduce((acc, score) => acc + score, 0);
        results.push({id: val, saldo: total});
        results = results.sort((a, b) => a.saldo - b.saldo );
      });
       clientObj[value[1]] = results[0].id;
       results = [];
    });
    return clientObj;
};
// 8 Agregar nuevo cliente con datos ficticios a "clientes" y agregar una cuenta en el BANCOESTADO con un saldo de 9000 para este nuevo empleado.
// Luego devolver el lugar que ocupa este cliente en el ranking de la pregunta 2.
// No modificar arreglos originales para no alterar las respuestas anteriores al correr la solución
function newClientRanking() {
  clients.push({ id: 7, taxNumber: '12345678', name: 'JUAN PEREZ BOLAÑOS'});
  accounts.push({ clientId: 7, bankId: 3, balance: 9000 });
  position = sortClientsTotalBalances().findIndex(positions => positions.saldo === 9000);
  return position;
};
// No modificar, eliminar o alterar cualquier línea de código o comentario de acá para abajo
// Cualquier cambio hará que su prueba quede invalidada automáticamente
console.log('Pregunta 0');
console.log(listClientsIds());
console.log('Pregunta 1');
console.log(listClientsIdsSortByTaxNumber());
console.log('Pregunta 2');
console.log(sortClientsTotalBalances());
console.log('Pregunta 3');
console.log(banksClientsTaxNumbers());
console.log('Pregunta 4');
console.log(richClientsBalances());
console.log('Pregunta 5');
console.log(banksRankingByTotalBalance());
console.log('Pregunta 6');
console.log(banksFidelity());
console.log('Pregunta 7');
console.log(banksPoorClients());
console.log('Pregunta 8');
console.log(newClientRanking());

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('TCIT CTO_developer');

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
