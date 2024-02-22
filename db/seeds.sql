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

INSERT INTO employee (first_name, last_name, role_id, department_id, salary, manager_name)
VALUES ( "John", "Wick", 1, 1, 100000, NULL),
       ( "Mike", "Chan", 2, 1,80000,"John Wick"),
       ( "Ashleigh", "Rodriquez", 3, 2, 150000, NULL),
       ( "Kevin", "Tupik", 4, 2, 120000, "Ashleigh Rodriquez"),
       ( "Kunal", "Singh", 5, 3, 160000, NULL),
       ( "Malia", "Brown", 6, 3, 125000,"Kunal Singh"),
       ( "Sarah", "Lourd", 7, 4,250000, NULL),
       ( "Tom", "Allen", 8, 4, 190000,"Sarah Lourd");
      
