package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Bank;
import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.repository.BankRepository;
import asianmobiles.lk.asianmobiles.repository.ItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping(value = "/itemsinventory")
public class ItemsInventoryController {



    @Autowired
    private ItemsRepository itemsRepository;
    //Creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //Creating a function to display the UserManagement UI.
    public ModelAndView itemsUi(){

        // create ModelAndView object called userui
        ModelAndView itemsui =  new ModelAndView();

        //set user.html
        itemsui.setViewName("ItemsInventory_Management.html");

        return itemsui;

    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Items> findAll (){

        return itemsRepository.getItemAvalibaleList();

    }


}






