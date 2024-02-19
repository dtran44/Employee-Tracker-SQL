INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role ( role_title, salary, department_id)
VALUES ( "Sales Lead", 100000, 1),
       ( "Salesperson", 80000, 1),
       ( "Lead Engineer", 150000, 2),
       ( "Software Engineer", 120000, 2),
       ( "Account Manager", 160000, 3),
       ( "Accountant", 125000, 3),
       ( "Legal Team Lead", 250000, 4),
       ( "Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ( "John", "John", NULL, NULL),
       ( "Mike", "Chan", 1, 2),
       ( "Ashleigh", "Rodriquez", NULL, NULL),
       ( "Kevin", "Tupik", 3, 4),
       ( "Kunal", "Singh", NULL, NULL),
       ( "Malia", "Brown", 5, 6),
       ( "Sarah", "Lourd", NULL, NULL),
       ( "Tom", "Allen", 7, 8),
       ( "Sam", "Kash", 3, 3);
