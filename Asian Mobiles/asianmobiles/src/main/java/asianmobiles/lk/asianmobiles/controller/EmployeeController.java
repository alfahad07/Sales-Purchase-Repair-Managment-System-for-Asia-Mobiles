package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Employee;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.EmployeeRepository;
import asianmobiles.lk.asianmobiles.repository.EmployeeStatusRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController // this annotation notify the user the services through the sever when the user request the sever.
@RequestMapping(value = "/employee")
public class EmployeeController {

    @Autowired
    private PrivilegeController privilagecontroller;
    @Autowired
    // this annnotation is used to create an instance or copy of an interface. so here EmployeeRepository is an iterface, to create an copy of it this annotation is used.
    private EmployeeRepository employeeDao;

    @Autowired // Created an employeeStatusDao Object a copy of EmployeeStatusRepository Interface for delete function to show thw status as deleted in the employee.js status column in the employee.js table.
    private EmployeeStatusRepository employeeStatusDao;

    @Autowired
    private UserRepository userDao;

    // creating getMapping annotation to get the employee.js UI.
    @GetMapping()
    //creating a function to display the employee.js ui
    public ModelAndView employeeUi() {

        // create ModelAndView object called employeeui
        ModelAndView employeeui = new ModelAndView();

        //set employee.js.html
        employeeui.setViewName("Employee_Management.html");

        return employeeui;
    }

    //METHOD 01 - GET MAPPING SERVICE TO GET EMPLOYEE BY GIVEN PATH VARIABLE ID [ /employee/getById/1 ] TO GET THE SELECTED EMPLOYEE OBJECT TO THE FORM WHEN CLICKED ON THE EDIT BTN ON THE EMPLOYEE TABLE.
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Employee getEmployeeByPVId(@PathVariable ("id") Integer id){

        return employeeDao.getReferenceById(id);

    }

    //METHOD 02 - GET MAPPING SERVICE TO GET EMPLOYEE BY GIVEN QUERY PARAM ID [ /employee.js/getById ] TO GET THE SELECTED EMPLOYEE OBJECT TO THE FORM WHEN CLICKED ON THE EDIT BTN ON THE EMPLOYEE TABLE.
    @GetMapping(value = "/getbyid", produces = "application/json")
    public Employee getEmployeeByQPId(@RequestParam ("id") Integer id ){

        return employeeDao.getReferenceById(id);

    }


    //Create get mapping to take all the employee.js data from the database to display on the browser as JSON OBJECT--->[/employee.js]
    @GetMapping(value = "/allemployee" , produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    //Create function for get all employee.js data
    public List<Employee> findAll(){

        return employeeDao.findAll();
    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/employee - POST]
    @PostMapping
    public String addEmployee( @RequestBody Employee employee ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "EMPLOYEE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Employee extEmployeeNic = employeeDao.getByNIC(employee.getNic());
            if ( extEmployeeNic != null ){

                return "Employee insert not completed : NIC Duplicated (NIC already Exist)";

            }

            //CHECKING THE EMAIL EXIS OR NOT IN THE DATABASE.
            Employee extEmployeeEmail = employeeDao.findEmployeeByEmail(employee.getEmail());
            if ( extEmployeeEmail != null ){

                return "Employee insert not completed : Email Duplicated (Email already Exist)";

            }

            try {

                //SET AUTO INSERT VALUE
                employee.setNumber(employeeDao.nextNumber());
                employee.setAdded_datetime(LocalDateTime.now());


                //SAVE THE CHANGES
                employeeDao.save(employee);
                return "0";

            }catch (Exception ex){

                return "Employee Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Employee insert not completed : You dont have access";

        }

    }

    //Create delete mapping to delete employee.js by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteEmployee( @RequestBody Employee employee ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "EMPLOYEE");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE | | |
            //                                               V V V

            //checking function to check wether the employee.js exist in the database
            Employee existEmployee = employeeDao.getReferenceById(employee.getId());

            // Creating a function to delete the employee.js from the database after checking the employee.js's existance.
            if(existEmployee != null){
                try{

                    //set auto insert Values
                    existEmployee.setDelete_date_time(LocalDateTime.now()); // Setting the delete time of the employee.js
                    existEmployee.setEmployeestatus_id(employeeStatusDao.getReferenceById(3)); // Setting employeeStatus to deleted once the delete is done

                    employeeDao.save(existEmployee);


                    // cross-checking the user account according to the employee and setting the user account status to inactive once the employee is deleted in employee management system
                    User employeeUserObject = userDao.findUserByEmployee(existEmployee.getId());

                    if(employeeUserObject != null) {

                        employeeUserObject.setStatus(false);
                        userDao.save(employeeUserObject);

                    }

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : employee Not Available";

            }


        }else {

            return "Employee Delete not completed : You don't have access";

        }

    }

    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/employee - POST]
    @PutMapping
    public String updateEmployee( @RequestBody Employee employee ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "EMPLOYEE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Employee extEmpByNIC = employeeDao.getByNIC(employee.getNic());
            if (extEmpByNIC != null && employee.getId() != extEmpByNIC.getId()) {

                return "Employee update not completed : NIC already Exist";

            }


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Employee extEmpByEmail = employeeDao.findEmployeeByEmail(employee.getEmail());
            if (extEmpByEmail != null && employee.getId() != extEmpByEmail.getId()) {

                return "Employee update not completed : E-Mail already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                employee.setLast_update_datetime(LocalDateTime.now());

                //SAVE THE CHANGES
                employeeDao.save(employee);

                // cross-checking the user account according to the employee and setting the user account status to inactive once the employee is deleted in employee management system
                User employeeUserObject = userDao.findUserByEmployee(employee.getId());

                if(employeeUserObject != null) {

                    if (employee.getEmployeestatus_id().getName().equals("Active")){

                        employeeUserObject.setStatus(true);

                    }else {

                        employeeUserObject.setStatus(false);

                    }

                    userDao.save(employeeUserObject);

                }

                return "0";

            }catch (Exception ex){

                return "Employee update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Employee update not completed : You dont have access";

        }

    }

}
