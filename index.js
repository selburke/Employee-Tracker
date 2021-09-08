const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
     host: 'localhost',
   
     port: 3306,
   
     user: 'root',
   
     password: '',
     database: 'employee_DB',
   });
   
   connection.connect((err) => {
     if (err) throw err;
   });

const employeeManagementSys = () => {
     inquirer
       .prompt({
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
           'Add Department',
           'Add Employee',
           'Add Role' 
         ],
       })
 
       .then((answer) => {
          switch (answer.choice) {
               case 'Add Department':
               addDepartment();
               break;
   
               case 'Add Employee':
               addEmployee();
               break;
   
               case 'Add Role':
               addRole();
               break;
   
               default:
               console.log(`Invalid`);
               break;
         }
       });
   };

const addDepartment = () => {
     let deptWQuotes = "'department'"
     inquirer
          .prompt({
               name: 'name',
               type: 'input',
               message: 'Which Department is this?',
          })
          .then((answer) => {
          connection.query('INSERT INTO department SET ?',
               {name: answer.name},
               (err) => {if (err) throw err;
               console.log("New Department Created.");
               })
          })
};

const addEmployee = () => {
     let empl = "`employee`";
     let rl = "'role'";
     connection.query('SELECT * FROM role', (err, role) => {
          if (err) throw err;
     inquirer
          .prompt([
          {
               name: "first_name",
               type: "input",
               message: "What is this employee's first name?",
          },
          {
               name: "last_name",
               type: "input",
               message: "What is this employee's last name?",
          },
          {
               name: "roleName",
               type: "list",
               message: "What is this employee's role?",
               choices() {
                    const roleList = [];
                    role.forEach(({ id, title })=> {
                        roleList.push(`${id} ${title}`)
                    });
                    return roleList;
                },   
          }
          ])
          .then((answer) => {
               const role = answer.roleName
               const roleAnswer = role.replace(/ .*/,'');

               connection.query('INSERT INTO ' + empl + ' SET ?',
          {
               first_name: answer.first_name,
               last_name: answer.last_name,
               role_id: roleAnswer || 0,
          },
               (err) => {
                    if (err) throw err;
                    console.log("New employee added.");
               })
          })
     })};

const addRole = () => {
     connection.query('SELECT * FROM department', (err, department_id) => {if (err) throw err;

     inquirer
          .prompt([
          {
               name: 'title',
               type: 'input',
               message: "What is the name of this role?"
          },
          {
               name: 'salary',
               type: 'input',
               message: "What is the salary for this role?"
          },
          {
               name: 'departmentName',
               type: 'list',
               message: "What department does this role fall under?",
               choices() {
                    const deptList = [];
                    department_id.forEach(({ id, name}) => {
                    deptList.push(`${id} ${name}`) 
                    });
                    return deptList;
               }
          }
     ])
          .then((answer) => {
               const dept = answer.departmentName;
               const deptId = dept.replace(/ .*/, '');
               connection.query('INSERT INTO role SET ?',
          {
               title: answer.title,
               salary: answer.salary,
               department_id: deptId || 0,
          },
               (err) => {
               if (err) throw err;
               console.log("New role added.")
               })
          })
     })
   };
 
employeeManagementSys();
