// comparator
function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    return a[0] < b[0] ? -1 : 1;
  }
}

let no_of_transaction = 4,
  friends = 4;

let x = ["p2", "p3", "p3", "p2"],
  y = ["p1", "p2", "p4", "p4"]; // string
let amount = [100, 500, 900, 600]; // interger/double

// map<string, int> net;
const net = new Map();
for (let i = 0; i < no_of_transaction; i++) {
  // whether net[x] or net[y] is exists or not!
  if (!net.has(x[i])) {
    net.set(x[i], 0);
  }
  if (!net.has(y[i])) {
    net.set(y[i], 0);
  }
  let xval = net.get(x[i]) - amount[i];
  let yval = net.get(y[i]) + amount[i];
  net.set(x[i], xval);
  net.set(y[i], yval);
}

// iterate over the persons those who have non zero net amount
let m = []; // array of pair of int and string

net.forEach(function (value, key) {
  let person = key;
  let Amount = value;

  if (net.get(person) != 0) {
    m.push([Amount, person]); // sorting acc to amount
  }
  // console.log(value + " " + key);
});

// make settlements
let transactions = 0;
m.sort(sortFunction);
while (m.length) {
  let low = m[0]; // pointing begining element
  let high = m[m.length - 1]; // pointing last element
  let debit = low[0];
  let debit_person = low[1];

  let credit = high[0];
  let credit_person = high[1];
  m.splice(0, 1);
  m.splice(m.length - 1, 1);

  let settled_amount = Math.min(-debit, credit);
  debit += settled_amount;
  credit -= settled_amount;

  console.log(
    debit_person + " will pay " + settled_amount + " to " + credit_person
  );

  if (debit != 0) {
    m.push([debit, debit_person]);
  }
  if (credit != 0) {
    m.push([credit, credit_person]);
  }
  m.sort(sortFunction);
  transactions++;
}
console.log("Reduced Transactions:" + transactions);
