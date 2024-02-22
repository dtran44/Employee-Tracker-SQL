const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  // user: 'root',
  // password: 'Leon123',
  // database: 'employees_db'
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME

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
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
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
      else if (answers.choice === 'View all employees') {
        viewAllEmployees();
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
      else if (answers.choice === 'Update an employee role') {
        updateEmployee();
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
      // Display the headings
      console.log('ID | Department Name');
      // Display the departments
      departments.forEach(department => {
        console.log(`${department.id.toString().padEnd(2)} | ${department.department_name}`);
      });
      // Prompt the user again after displaying departments
      startApp();
    });
  }


// Function to view all roles
function viewAllRoles() {
    // Query to select all roles with department names
    const query = 'SELECT r.id, r.role_title, r.salary, d.department_name AS department FROM role r JOIN department d ON r.department_id = d.id';
    // Execute the query
    connection.query(query, (err, roles) => { 
      if (err) {
        console.error('Error retrieving roles: ' + err.stack);
        return;
      }
      // Display the headings
      console.log('ID | Role title      | Salary  | Department');
      // Display the roles
      roles.forEach(role => {
        console.log(`${role.id.toString().padEnd(2)} | ${role.role_title.padEnd(15)} | ${role.salary.toString().padEnd(7)} | ${role.department}`);
      });
      // Prompt the user again after displaying roles
      startApp();
    });
}


function viewAllEmployees() {
  // Query to select all employees with relevant details including role and department names
  const query = `
      SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.role_title AS role_name, 
          d.department_name AS department_name, 
          e.salary, 
          e.manager_name 
      FROM 
          employee e
      INNER JOIN
          role r ON e.role_id = r.id
      INNER JOIN
          department d ON e.department_id = d.id`;

  // Execute the query
  connection.query(query, (err, employees) => { 
      if (err) {
          console.error('Error retrieving employees: ' + err.stack);
          return;
      }
      // Display the headings
      console.log('ID | First Name | Last Name | Role            | Department    | Salary | Manager');
      // Display the employees
      employees.forEach(employee => {
          console.log(`${employee.id.toString().padEnd(2)} | ${employee.first_name.padEnd(10)} | ${employee.last_name.padEnd(9)} | ${employee.role_name.padEnd(15)} | ${employee.department_name.padEnd(12)} | ${employee.salary.toString().padEnd(7)} | ${employee.manager_name}`);
      });
      // Prompt the user again after displaying employees
      startApp();
  });
}


// Function to add a department
function addDepartment() {
    inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the department:'
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
    // Query to fetch the list of departments with their IDs
    const query = 'SELECT id, department_name FROM department';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments: ' + err.stack);
            return;
        }
        // Create an object to map department names to their IDs
        const departmentMap = {};
        results.forEach(row => {
            departmentMap[row.department_name] = row.id;
        });

        // Extract department names from results for Inquirer choices
        const departmentChoices = results.map(row => row.department_name);

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'What is the title of the role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for this role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departmentChoices
            }
        ]).then(answers => {
            // Get the department ID based on the selected department name
            const departmentId = departmentMap[answers.department];

            // Query to insert the new role
            const insertQuery = 'INSERT INTO role (role_title, salary, department_id) VALUES (?, ?, ?)';
            // Execute the query
            connection.query(insertQuery, [answers.roleTitle, answers.salary, departmentId], (err, result) => {
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
    });
}



// Function to add an employee
function addEmployee() {
  // Query to fetch the list of roles along with department ID and salary
  const roleQuery = 'SELECT id, role_title, department_id, salary FROM role';
  // Query to fetch the list of manager names
  const managerQuery = 'SELECT CONCAT(first_name, " ", last_name) AS manager_name FROM employee WHERE manager_name IS NOT NULL';

  // Execute both queries in parallel using Promise.all
  Promise.all([
      new Promise((resolve, reject) => {
          connection.query(roleQuery, (err, roles) => {
              if (err) reject(err);
              resolve(roles);
          });
      }),
      new Promise((resolve, reject) => {
          connection.query(managerQuery, (err, managers) => {
              if (err) reject(err);
              resolve(managers.map(manager => manager.manager_name));
          });
      })
  ]).then(([roles, managerChoices]) => {
      const roleTitles = roles.map(role => role.role_title);
      inquirer.prompt([
          {
              type: 'input',
              name: 'firstName',
              message: 'What is the employee\'s first name?'
          },
          {
              type: 'input',
              name: 'lastName',
              message: 'What is the employee\'s last name?'
          },
          {
              type: 'list',
              name: 'role',
              message: 'What is the employee\'s role?',
              choices: roleTitles
          },
          {
              type: 'list',
              name: 'manager',
              message: 'Who is the employee\'s manager?',
              choices: managerChoices
          }
      ]).then(answers => {
          // Find the selected role in the roles array
          const selectedRole = roles.find(role => role.role_title === answers.role);
          const roleId = selectedRole.id;
          const departmentId = selectedRole.department_id;
          const salary = selectedRole.salary;

          // Retrieve the manager name based on the selected manager
          const managerName = answers.manager;

          // Query to insert the new employee
          const insertQuery = 'INSERT INTO employee (first_name, last_name, manager_name, role_id, department_id, salary) VALUES (?, ?, ?, ?, ?, ?)';
          // Execute the query
          connection.query(insertQuery, [answers.firstName, answers.lastName, managerName, roleId, departmentId, salary], (err, result) => {
              if (err) {
                  console.error('Error adding employee: ' + err.stack);
                  return;
              }
              console.log('Employee added successfully!');
              // Prompt the user again after adding employee
              startApp();
          });
      }).catch(error => {
          console.log('Error occurred:', error);
      });
  }).catch(error => {
      console.log('Error fetching choices:', error);
  });
}

// Function to update an employee's role
// Function to fetch employee names from the database
function fetchEmployeeNames() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
      connection.query(query, (err, employees) => {
          if (err) {
              reject(err);
              return;
          }
          const employeeNames = employees.map(employee => employee.employee_name);
          resolve(employeeNames);
      });
  });
}

// Function to update an employee's role
// Function to fetch role titles from the database
function fetchRoleTitles() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT role_title FROM role';
      connection.query(query, (err, roles) => {
          if (err) {
              reject(err);
              return;
          }
          const roleTitles = roles.map(role => role.role_title);
          resolve(roleTitles);
      });
  });
}

// Update employee function
function updateEmployee() {
  // Fetch role titles
  fetchRoleTitles()
      .then(roleTitles => {
          // Now you have role titles, proceed with updating employee
          // Fetch employee names from the database
          fetchEmployeeNames()
              .then(employeeChoices => {
                  // Prompt user for employee name and new role
                  inquirer.prompt([
                      {
                          type: 'list',
                          name: 'employeeName',
                          message: 'Which employee\'s role do you want to update?',
                          choices: employeeChoices
                      },
                      {
                          type: 'list',
                          name: 'role',
                          message: 'Which role do you want to assign to the selected employee?',
                          choices: roleTitles
                      }
                  ]).then(answers => {
                      // Find the selected role ID based on the selected role title
                      const roleName = answers.role;
                      const roleIdQuery = 'SELECT id FROM role WHERE role_title = ?';
                      connection.query(roleIdQuery, [roleName], (err, roleResult) => {
                          if (err) {
                              console.error('Error fetching role ID: ' + err.stack);
                              return;
                          }
                          const roleId = roleResult[0].id;

                          // Update the employee's role based on the selected employee name
                          const updateQuery = 'UPDATE employee SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?';
                          connection.query(updateQuery, [roleId, answers.employeeName], (err, result) => {
                              if (err) {
                                  console.error('Error updating employee role: ' + err.stack);
                                  return;
                              }
                              console.log('Employee role updated successfully!');
                              // Go back to the main menu
                              startApp();
                          });
                      });
                  }).catch(error => {
                      console.log('Error occurred:', error);
                  });
              })
              .catch(error => {
                  console.log('Error fetching employee names:', error);
              });
      })
      .catch(error => {
          console.log('Error fetching role titles:', error);
      });
}




