// Imports
const connection = require('./connection/connection');
const inquire = require('inquirer');
const consTable = require('console.table');

// Starting Function
function start() {
    connection.connect((err) => {
      if (err) throw err;
      console.log('Connected!');
      selection();
    });
};

const choices = [
    {
      type: 'list',
      name: 'options',
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

const newEmployees = (roleChoices, managerChoices) => [
    {
      type: 'input',
      name: 'first_name',
      message: "What's the employee's first name?",
      validate: input => !!input
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What's the employee's last name?",
      validate: input => !!input
    },
    {
      type: 'list',
      name: 'role',
      message: "What's the employee's role?",
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager',
      message: "What's the employee's manager?",
      choices: managerChoices
    }
];

const newRole = (departmentsChoices) => [
    {
      type: 'input',
      name: 'title',
      message: "What's the title of this role?",
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

//Prompts to remove
const employees = (employeesChoices) => [
  {
    type: 'list',
    name: 'employee',
    message: 'Who would you like to delete?',
    choices: employeesChoices
  }
];

const roles = (rolesChoices) => [
  {
    type: 'list',
    name: 'role',
    message: 'What role would you like to delete?',
    choices: rolesChoices
  }
];

const departments = (departmentsChoices) => [
  {
    type: 'list',
    name: 'department',
    message: 'Which department would you like to erase?',
    choices: departmentsChoices
  }
];

// Adding Functions
function addDepartment(answers) {
  const addingDb = `INSERT INTO departments (name) VALUES (?)`;

  connection.query(addingDb, answers, (err) => {
    if (err) throw err;
  });
};

function addEmployee(answers) {
  const addingDb = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

  connection.query(addingDb, answers, (err) => {
    if (err) throw err;
  });
};

function addRoles(answers) {
  const addingDb = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

  connection.query(addingDb, answers, (err) => {
    if (err) throw err;
  });
};

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

function viewManagers() {
  connection.query('SELECT * FROM managers', (err, res) => {
    if (err) throw err;
    let table = consTable.getTable(res);
    console.log(table);
  });
};

// Updating Employees
const updateEmployeeRole = (employeesChoices, roleChoices) => [
  {
    type: 'list',
    name: 'name',
    message: "Which employee do you want to update?",
    choices: employeesChoices
  },
  {
    type: 'list',
    name: 'role',
    message: "What is the employee\'s role?",
    choices: roleChoices
  }
];

const updateEmployeeManager = (employeesChoices, managerChoices) => [
  {
    type: 'list',
    name: 'name',
    message: "Which employee do you want to update?",
    choices: employeesChoices
  },
  {
    type: 'list',
    name: 'manager',
    message: "Who is the employee's manager?",
    choices: managerChoices
  }
];

function updateEmployeeRoleDb(id) {
  const updateDb = `UPDATE employees
  SET role_id = ?
  WHERE id = ?`;

  connection.query(updateDb, id, (err) => {
      if (err) throw err;
  });
};

function updateEmployeeManagerDb(id) {
  const updateDb = `UPDATE employees
  SET manager_id = ?
  WHERE id = ?`;

  connection.query(updateDb, id, (err) => {
      if (err) throw err;
  });
};

// View employee by Manager
const viewByManager = (managersChoices) => [
  {
    type: 'list',
    name: 'manager',
    message: 'Which employee would you like to view?',
    choices: managersChoices
  }
];

// Deleting Functions
function removeDepartment(id) {
  const delDb = `DELETE FROM departments WHERE id = ?`;

  connection.query(delDb, id, (err) => {
      if (err) throw err;
  });
}

function removeEmployee(id) {
  const delDb = `DELETE FROM employees WHERE id = ?`;

  connection.query(delDb, id, (err) => {
      if (err) throw err;
  });
};

function removeRole(id) {
  const delDb = `DELETE FROM roles WHERE id = ?`;

  connection.query(delDb, id, (err) => {
      if (err) throw err;
  });
};

//Prompts to View
function promptViewByDepartment() {
  viewDepartments(rows => {
    const departmentsChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    viewEmployees(rows => {
      inquirer.prompt(viewByDepartment(departmentsChoices))
        .then(data => {
          departmentsChoices.map(dept => {
            if (dept.value === data.department) {
              let department = [];
              rows.map(row => {
                if (row.department === dept.name) {
                  department.push(row);
                };
              });
              
              if (department.length !== 0) console.table(department);
              else console.log('No one is here!');

              selection();
            };
          });
        });
    });
  });
};

function promptViewByManager() {
  viewManagers(rows => {
    const managerChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    viewEmployees(rows => {
      inquirer.prompt(viewByManager(managerChoices))
        .then(data => {
          managerChoices.map(manager => {
            if (manager.value === data.manager) {
              let manager = [];
              rows.map(row => {
                if (row.manager === manager.name) {
                  manager.push(row);
                };
              });
              
              if (manager.length !== 0) console.table(manager);
              else console.log('No one is here!');

              selection();
            };
          });
        });
    });
  });
};

//Prompt to Add
function promptAddDepartment() {
  inquirer.prompt(newDepartment).then(data => {
    const newDepart = [
      data.department
    ];

    addDepartment(newDepart);
    console.log(`${newDepart} has been added!`);
    selection();
  });
};

function promptAddEmployee() {
  viewRoles(rows => {
    const roleChoices = rows.map(row => ({
      name: row.title,
      value: row.id
    }));

    viewManagers(rows => {
      const managerChoices = rows.map(row => ({
        name: row.name,
        value: row.id
      }));
      inquirer.prompt(newEmployees(roleChoices, managerChoices))
        .then(data => {
          const params = [
            data.first_name,
            data.last_name,
            data.role,
            data.manager
          ];

          addEmployee(params);
          console.log(`Added ${data.first_name} ${data.last_name} Successfully!`);
          selection();
        });
    });
  });
};

function promptAddRole() {
  viewDepartments(rows => {
    const departmentsChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    inquirer.prompt(newRole(departmentsChoices))
      .then(data => {
        const params = [
          data.title,
          data.salary,
          data.department
        ];

        addRoles(params);
        console.log(`Added ${data.title} Successfully!`);
        selection();
      });
  });
};

// Prompt to Update
function promptUpdateEmployeeRole() {
  viewEmployees(rows => {
    const employeesChoices = rows.map(row => ({
      name: `${row.first_name} ${row.last_name}`,
      value: row.id
    }));

    viewRoles(rows => {
      const roleChoices = rows.map(row => ({
        name: row.title,
        value: row.id
      }));

      inquirer.prompt(updateEmployeeRole(employeesChoices, roleChoices))
        .then(data => {
          const params = [
            data.role,
            data.name
          ];

          updateEmployeeRoleDb(params);
          employeesChoices.map(role => {
            if (role.value === data.role)
              console.log(`Updated the Role of ${role.name} Successfully!`);
          });

          selection();
        });
    });
  });
};

function promptUpdateEmployeeManager() {
  viewEmployees(rows => {
    const employeesChoices = rows.map(row => ({
      name: `${row.first_name} ${row.last_name}`,
      value: row.id
    }));

    viewManagers(rows => {
      const managerChoices = rows.map(row => ({
        name: row.name,
        value: row.id
      }));

      inquirer.prompt(updateEmployeeManager(employeesChoices, managerChoices))
        .then(data => {
          const params = [
            data.manager,
            data.name
          ];

          updateEmployeeManagerDb(params);
          employeesChoices.map(role => {
            if (role.value === data.name)
              console.log(`Updated the Manager of ${role.name} Successfully!`);
          });

          selection();
        });
    });
  });
};

//Prompts to Delete
function promptRemoveDepartment() {
  viewDepartments(rows => {
    const departmentsChoices = rows.map(row => ({
      name: row.name,
      value: row.id
    }));

    inquirer.prompt(departments(departmentsChoices))
      .then(data => {
        const params = [
          data.department
        ];

        removeDepartment(params);
        departmentsChoices.map(depart => {
          if (depart.value === data.department)
            console.log(`You have erased ${depart.name} from Departments!`);
        });
        selection();
      });
  });
};

function promptRemoveRole() {
  viewRoles(rows => {
    const rolesChoices = rows.map(row => ({
      name: row.title,
      value: row.id
    }));

    inquirer.prompt(roles(rolesChoices))
      .then(data => {
        const params = [
          data.role
        ];

        removeRole(params);
        rolesChoices.map(role => {
          if (role.value === data.role)
            console.log(`You have removed ${role.name} from Roles!`);
        });
        selection();
      });
  });
};

function promptRemoveEmployee() {
  viewEmployees(rows => {
    const employeesChoices = rows.map(row => ({
      name: `${row.first_name} ${row.last_name}`,
      value: row.id
    }));
    inquirer.prompt(employees(employeesChoices))
      .then(data => {
        const params = [
          data.employee
        ];

        removeEmployee(params);
        employeesChoices.map(emp => {
          if (emp.value === data.employee)
            console.log(`You have removed ${emp.name} from Employees!`);
        });
        selection();
      });
  });
};

async function selection() {
  const { options } = await inquirer.prompt(choices);
  switch (options) {
    case "That's it!":
      break;

    case 'View All Employees':
      viewEmployees(rows => {
        console.table(rows);
        selection();
      });
      break;

    case 'View All Employees By Department':
      promptViewByDepartment();
      break;

    case 'View All Employees By Manager':
      promptViewByManager();
      break;

    case 'View All Departments':
      viewDepartments(rows => {
        const newDept = rows.map((row) =>
        ({
          Departments: row.name
        }));
        console.table(newDept);
        selection();
      });
      break;

    case 'View All Roles':
      viewRoles(rows => {
        const newRoles = rows.map((row) =>
        ({
          Roles: row.title,
          Salary: row.salary,
          Department: row.department
        }));

        console.table(newRoles);
        selection();
      });
      break;

    case 'Add Employee':
      promptAddEmployee();
      break;

    case 'Remove Employee':
      promptRemoveEmployee();
      break;

    case 'Update Employee Role':
      promptUpdateEmployeeRole();
      break;

    case 'Update Employee Manager':
      promptUpdateEmployeeManager();
      break;

    case 'Add Role':
      promptAddRole();
      break;

    case 'Remove Role':
      promptRemoveRole();
      break;

    case 'Add Department':
      promptAddDepartment();
      break;

    case 'Remove Department':
      promptRemoveDepartment();
      break;
  };
};

start();