const inquirer = require('inquirer');
const {
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    getRoles,
    getDepartments,
    getEmployees
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
            const departments = await getDepartments();
            const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

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
                    type: 'list',
                    message: 'Select the department:',
                    choices: departmentChoices,
                },
            ]);
            console.log('Added role:', await addRole(title, salary, department_id));
            break;
        case 'Add an employee':
            const roles = await getRoles();
            const employees = await getEmployees();
            const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
            const managerChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
            managerChoices.unshift({ name: 'None', value: null });

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
                    type: 'list',
                    message: 'Select the employee role:',
                    choices: roleChoices,
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the employee manager (if any):',
                    choices: managerChoices,
                },
            ]);
            console.log('Added employee:', await addEmployee(first_name, last_name, role_id, manager_id));
            break;
        case 'Update an employee role':
            const allEmployees = await getEmployees();
            const allRoles = await getRoles();
            const employeeChoices = allEmployees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
            const newRoleChoices = allRoles.map(role => ({ name: role.title, value: role.id }));

            const { employee_id, new_role_id } = await inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    name: 'new_role_id',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: newRoleChoices,
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
