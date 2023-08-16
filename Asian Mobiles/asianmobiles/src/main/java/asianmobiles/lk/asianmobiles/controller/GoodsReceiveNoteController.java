package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.*;
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
@RequestMapping(value = "/goodsreceivenote")
public class GoodsReceiveNoteController {


    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private GoodsReceiveNoteRepository goodsReceiveNoteDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private GoodsReceiveNoteStatusRepository goodsReceiveNoteStatusDao;



    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public GoodsReceiveNote getGoodsReceiveNoteByPVId (@PathVariable("id") int id){

        return goodsReceiveNoteDao.getReferenceById(id);

    }


    @GetMapping
    //creating a function to display the GoodsReceiveNote UI.
    public ModelAndView goodsReceiveNoteUi() {

        // create ModelAndView object called goodsReceiveNoteui
        ModelAndView goodsReceiveNoteui = new ModelAndView();

        //set GoodsReceiveNote_Management.html to goodsReceiveNoteui...
        goodsReceiveNoteui.setViewName("GoodsReceiveNote_Management.html");

        return goodsReceiveNoteui;
    }


    @GetMapping(value = "/findall", produces = "application/json")
    public List<GoodsReceiveNote> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "GOODS-RECEIVE-NOTE");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return goodsReceiveNoteDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<GoodsReceiveNote> purchaseOrderList = new ArrayList<>();
            return  purchaseOrderList;

        }

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteGoodsReceiveNote( @RequestBody GoodsReceiveNote goodsReceiveNote ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "GOODS-RECEIVE-NOTE");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            GoodsReceiveNote existGoodsReceiveNote = goodsReceiveNoteDao.getReferenceById(goodsReceiveNote.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existGoodsReceiveNote != null){
                try{

                    //set auto insert Values
                    existGoodsReceiveNote.setDeleted_datetime(LocalDateTime.now()); //Setting the delete time of the user...
                    existGoodsReceiveNote.setGoods_receive_note_status_id(goodsReceiveNoteStatusDao.getReferenceById(3)); //Setting Status to "deleted" once the delete is done...

                    goodsReceiveNoteDao.save(existGoodsReceiveNote);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Goods Receive Note Not Available";

            }


        }else {

            return "Goods Receive Note Delete not completed : You don't have access";

        }

    }


    @PostMapping
    @Transactional
    public String addInnerGoodsReceiveNote( @RequestBody GoodsReceiveNote goodsReceiveNote ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "GOODS-RECEIVE-NOTE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){


            try {


                //SET AUTO INSERT VALUE
                goodsReceiveNote.setAdded_datetime(LocalDateTime.now());
                goodsReceiveNote.setAdded_user_id(loggedUser);


                String lastGoodsReceiveNoteCodeNo = goodsReceiveNoteDao.getLastGrnNo();
                String nextGoodsReceiveNoteCodeNo = "";
                LocalDate currentDate = LocalDate.now();

                int currentMonth          = currentDate.getMonth().getValue();
                String currentYearString  = String.valueOf(currentDate.getYear());
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;


                if (lastGoodsReceiveNoteCodeNo != null){

                    if (lastGoodsReceiveNoteCodeNo.substring(3,7).equals(currentYearString)){

                        if (lastGoodsReceiveNoteCodeNo.substring(7,9).equals(currentMonthString)){

                            nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + String.format("%03d" ,Integer.valueOf(lastGoodsReceiveNoteCodeNo.substring(9)) + 1);

                        }else {

                            nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                        }

                    }else {

                        nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                    }

                }else {

                    nextGoodsReceiveNoteCodeNo = "GRN" + currentDate.getYear() + currentMonthString + "001";

                }

                goodsReceiveNote.setGrn_code(nextGoodsReceiveNoteCodeNo);


                for (GoodsReceiveNoteHasModel goodsReceiveNoteHasModel : goodsReceiveNote.getGoodsReceiveNoteHasModelList()){

                    goodsReceiveNoteHasModel.setGoods_receive_note_id(goodsReceiveNote);

                }

                goodsReceiveNoteDao.save(goodsReceiveNote);

                return "0";

            }catch (Exception ex){

                return "Goods Receive Note Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Goods Receive Note insert not completed : You dont have access";

        }

    }


    //CREATE PUT MAPPING FUNCTION TO UPDATE GRN [/goodsreceivenote - PUT]
    @PutMapping
    public String updatePurchaseOrder( @RequestBody  GoodsReceiveNote goodsReceiveNote ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "GOODS-RECEIVE-NOTE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){


            //checking function to check weather the Quotation exist in the database
            GoodsReceiveNote existGoodsReceiveNote = goodsReceiveNoteDao.getReferenceById(goodsReceiveNote.getId());

            if (existGoodsReceiveNote != null){

                try {

                    //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                    goodsReceiveNote.setLast_updated_datetime(LocalDateTime.now());
                    goodsReceiveNote.setUpdated_user_id(loggedUser);

                    //SAVE THE CHANGES
                    for (GoodsReceiveNoteHasModel goodsReceiveNoteHasModel : goodsReceiveNote.getGoodsReceiveNoteHasModelList()) {
                        goodsReceiveNoteHasModel.setGoods_receive_note_id(goodsReceiveNote);
                    }
                    goodsReceiveNoteDao.save(goodsReceiveNote);

                    return "0";

                }catch (Exception ex){

                    return "Goods Receive Note update is incomplete : " + ex.getMessage();

                }

            }else{

                return "Update Not Completed : Goods Receive Note Not Available";

            }

        }else {

            return "Goods Receive Note update not completed : You dont have access";

        }

    }


}
