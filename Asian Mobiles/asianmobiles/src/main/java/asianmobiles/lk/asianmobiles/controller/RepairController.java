package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.PreOrder;
import asianmobiles.lk.asianmobiles.entity.PreOrderHasModel;
import asianmobiles.lk.asianmobiles.entity.Repair;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/repair")
public class RepairController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private RepairRepository repairDao;

    @Autowired
    private  RepairHasItemRepository repairHasItemDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private RepairStatusRepository repairStatusDao;



    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Repair getRepairByPVId (@PathVariable("id") int id){

        return repairDao.getReferenceById(id);

    }


    //CREATED A LIST TO GET THE MAIN DETAILS OF THE ITEMS TO THE ITEM DROPDOWN(COMBO BOX) IN INNER FORM OF THE ITEM MODULE...
    /*@GetMapping(value = "/list", produces = "application/json")
    public List<Repair> repairList () {

        return repairDao.list();

    }*/

    @GetMapping
    //creating a function to display the PREORDER UI.
    public ModelAndView repairUi() {

        // create ModelAndView object called employeeui
        ModelAndView repairui = new ModelAndView();

        //set employee.js.html
        repairui.setViewName("Repair_Management.html");

        return repairui;
    }


   @GetMapping(value = "/findall", produces = "application/json")
    public List<Repair> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "REPAIR");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return repairDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<Repair> repairList = new ArrayList<>();
            return  repairList;

        }

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteRepair( @RequestBody Repair repair ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "REPAIR");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            Repair existRepair = repairDao.getReferenceById(repair.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existRepair != null){

                try{

                    //set auto insert Values
                    existRepair.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the user
                    existRepair.setRepair_status_id(repairStatusDao.getReferenceById(5)); // Setting userStatus to deleted once the delete is done

                    repairDao.save(existRepair);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Repair Not Available";

            }


        }else {

            return "Repair Delete not completed : You don't have access";

        }

    }

/*
    @PostMapping
    @Transactional
    public String addInnerPreOrder( @RequestBody PreOrder preOrder ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PRE-ORDER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){


            try {


                //SET AUTO INSERT VALUE
                preOrder.setAdded_datetime(LocalDateTime.now());
                preOrder.setAdded_user_id(loggedUser);


                String lastPreOrderNo = preOrderDao.getLastPreOrderCode();
                String nextPreOrderNo = "";
                LocalDate currentDate = LocalDate.now();

                int currentMonth          = currentDate.getMonth().getValue();
                String currentYearString  = String.valueOf(currentDate.getYear());
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;


                if (lastPreOrderNo != null){

                    if (lastPreOrderNo.substring(3,7).equals(currentYearString)){

                        if (lastPreOrderNo.substring(7,9).equals(currentMonthString)){

                            nextPreOrderNo = "CPO" + currentDate.getYear() + currentMonthString + String.format("%03d" ,Integer.valueOf(lastPreOrderNo.substring(9)) + 1);

                        }else {

                            nextPreOrderNo = "CPO" + currentDate.getYear() + currentMonthString + "001";

                        }

                    }else {

                        nextPreOrderNo = "CPO" + currentDate.getYear() + currentMonthString + "001";

                    }

                }else {

                    nextPreOrderNo = "CPO" + currentDate.getYear() + currentMonthString + "001";

                }

                preOrder.setPre_order_code(nextPreOrderNo);


                PreOrder newPreOrder = preOrderDao.saveAndFlush(preOrder);

                for (PreOrderHasModel preOrderHasModel : preOrder.getPreOrderHasModelList()){

                    preOrderHasModel.setPre_order_id(newPreOrder);
                    preOrderHasModelDao.save(preOrderHasModel);

                }

                return "0";

            }catch (Exception ex){

                return "Pre-Order Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Pre-Order insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/Model - PUT]
    @PutMapping
    public String updatePreOrder( @RequestBody  PreOrder preOrder ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "PRE-ORDER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){


            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                preOrder.setLast_updated_datetime(LocalDateTime.now());
                preOrder.setUpdated_user_id(loggedUser);

                //SAVE THE CHANGES
                for (PreOrderHasModel preOrderHasModel : preOrder.getPreOrderHasModelList()) {
                    preOrderHasModel.setPre_order_id(preOrder);
                }

                preOrderDao.save(preOrder);

                return "0";

            }catch (Exception ex){

                return "Pre-Order update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Pre-Order update not completed : You dont have access";

        }

    }*/


}
