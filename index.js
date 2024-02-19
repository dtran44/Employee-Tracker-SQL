const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Leon123',
  database: 'employees_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
  // Start the application
  startApp();
});

// Function to start the application
function startApp() {
  // Array of questions
  const questions = [
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    }
  ];

  // Prompt user with questions
  inquirer.prompt(questions)
    .then(answers => {
      // Handle user responses here
      console.log('User choice:', answers.choice);
      if (answers.choice === 'View all departments') {
        viewAllDepartments();
      } 
      else if (answers.choice === 'View all roles') {
        viewAllRoles();
      } 
      else if (answers.choice === 'Add a department') {
        addDepartment();
      } 
      else if (answers.choice === 'Add a role') {
        addRole();
      } 
      else if (answers.choice === 'Add an employee') {
        addEmployee();
      } 
      else {
        // Implement other choices if needed
        console.log('Choice not implemented yet');
      }
    })
    .catch(error => {
      console.log('Error occurred:', error);
    });
}

// Function to view all departments
function viewAllDepartments() {
  // Query to select all departments
  const query = 'SELECT * FROM department';
  // Execute the query
  connection.query(query, (err, departments) => {
    if (err) {
      console.error('Error retrieving departments: ' + err.stack);
      return;
    }
    // Display the departments
    console.log('All Departments:');
    departments.forEach(department => {
      console.log(`ID: ${department.id} | Department Name: ${department.department_name}`);
    });
    // Prompt the user again after displaying departments
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
    // Query to select all roles
    const query = 'SELECT * FROM role';
    // Execute the query
    connection.query(query, (err, roles) => { // Fixed variable name here
      if (err) {
        console.error('Error retrieving roles: ' + err.stack);
        return;
      }
      // Display the roles
      console.log('All roles:');
      roles.forEach(role => {
        console.log(`ID: ${role.id} | Role title: ${role.role_title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
      });
      // Prompt the user again after displaying roles
      startApp();
    });
}

// Function to add a department
function addDepartment() {
    inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:'
    }).then(answer => {
      // Query to insert the new department
      const query = 'INSERT INTO department (department_name) VALUES (?)';
      // Execute the query
      connection.query(query, [answer.departmentName], (err, result) => {
        if (err) {
          console.error('Error adding department: ' + err.stack);
          return;
        }
        console.log('Department added successfully!');
        // Prompt the user again after adding department
        startApp();
      });
    }).catch(error => {
      console.log('Error occurred:', error);
    });
  }

  // Function to add a role
  function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of the role:'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter the salary for this role:'
        },
        {
            type: 'number',
            name: 'departmentId',
            message: 'Enter the department ID for this role:'
        }
    ]).then(answers => {
        // Query to insert the new role
        const query = 'INSERT INTO role (role_title, salary, department_id) VALUES (?, ?, ?)';
        // Execute the query
        connection.query(query, [answers.roleTitle, answers.salary, answers.departmentId], (err, result) => {
            if (err) {
                console.error('Error adding role: ' + err.stack);
                return;
            }
            console.log('Role added successfully!');
            // Prompt the user again after adding role
            startApp();
        });
    }).catch(error => {
        console.log('Error occurred:', error);
    });
}