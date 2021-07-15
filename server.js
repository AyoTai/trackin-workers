// Imports
const connection = require('./connection/connection');
const inquire = require('inquirer');
const consTable = require('console.table');

// Starting Function
function start() {
    connection.connect(err => {
      if (err) throw err;
      selection();
    });
};

const choices = [
    {
      type: 'list',
      name: 'action',
      message: 'Hi! What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Add Role',
        'Remove Role',
        'View All Departments',
        'Add Department',
        'Remove Department',
        "That's it!"
      ]
    }
];

// Prompts for adding
const newDepartment = [
    {
      type: 'input',
      name: 'department',
      message: 'What\'s the title of this department?',
      validate: input => !!input
    }
];

const newEmployees = (roleChoices, managerChoices) => [
    {
      type: 'input',
      name: 'first_name',
      message: "What\'s the employee's first name?",
      validate: input => !!input
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What\'s the employee's last name?",
      validate: input => !!input
    },
    {
      type: 'list',
      name: 'role',
      message: "What\'s the employee's role?",
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager',
      message: "What\'s the employee's manager?",
      choices: managerChoices
    }
];

const newRole = (departmentsChoices) => [
    {
      type: 'input',
      name: 'title',
      message: 'What\'s the title of this role?',
      validate: input => !!input
    },
    {
      type: 'input',
      name: 'salary',
      message: 'How much for the salary?',
      validate: input => !!input
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department will it belong to?',
      choices: departmentsChoices
    }
];

// Adding Functions
function addDepartment(answers) {
  const addingDb = `INSERT INTO departments (name) VALUES (?)`;

  connection.query(addingDb, answers, (err) => {
      if (err) throw err;
  });
}

function addEmployee(answers) {
  const addingDb = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

  connection.query(addingDb, answers, (err) => {
      if (err) throw err;
  });
}

function addRoles(answers) {
  const addingDb = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

  connection.query(addingDb, answers, (err) => {
      if (err) throw err;
  });
}

// Viewing Functions
function viewDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        let table = consTable.getTable(res);
        console.log(table);
    });
};

function viewRoles() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        let table = consTable.getTable(res);
        console.log(table);
    });
};

function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        let table = consTable.getTable(res);
        console.log(table);
    });
};

// 