const connection = require('./connection/connection');
const inquire = require('inquirer');
const consTable = require('console.table');


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

const newDepartment = [
    {
      type: 'input',
      name: 'department',
      message: 'What\'s the title of this department?',
      validate: input => !!input
    }
];

const addEmployee = (roleChoices, managerChoices) => [
    {
      type: 'input',
      name: 'first_name',
      message: "What/'s the employee's first name?",
      validate: input => !!input
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What/'s the employee's last name?",
      validate: input => !!input
    },
    {
      type: 'list',
      name: 'role',
      message: "What/'s the employee's role?",
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager',
      message: "What/'s the employee's manager?",
      choices: managerChoices
    }
];

