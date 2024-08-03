const inquirer = require('inquirer');
const {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
} = require('./db/queries');

const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ],
    });

    switch (action) {
        case 'View all departments':
            console.table(await viewDepartments());
            break;
        case 'View all roles':
            console.table(await viewRoles());
            break;
        case 'View all employees':
            console.table(await viewEmployees());
            break;
        case 'Add a department':
            const { name: deptName } = await inquirer.prompt({
                name: 'name',
                type: 'input',
                message: 'Enter the department name:',
            });
            console.log('Added department:', await addDepartment(deptName));
            break;
        case 'Add a role':
            const { title, salary, department_id } = await inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the role title:',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the role salary:',
                },
                {
                    name: 'department_id',
                    type: 'input',
                    message: 'Enter the department ID:',
                },
            ]);
            console.log('Added role:', await addRole(title, salary, department_id));
            break;
        case 'Add an employee':
            const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the employee first name:',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the employee last name:',
                },
                {
                    name: 'role_id',
                    type: 'input',
                    message: 'Enter the role ID:',
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: 'Enter the manager ID (leave blank if none):',
                    default: null
                },
            ]);
            console.log('Added employee:', await addEmployee(first_name, last_name, role_id, manager_id));
            break;
        case 'Update an employee role':
            const { employee_id, new_role_id } = await inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'input',
                    message: 'Enter the employee ID:',
                },
                {
                    name: 'new_role_id',
                    type: 'input',
                    message: 'Enter the new role ID:',
                },
            ]);
            console.log('Updated employee:', await updateEmployeeRole(employee_id, new_role_id));
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
    mainMenu();
};

mainMenu();
