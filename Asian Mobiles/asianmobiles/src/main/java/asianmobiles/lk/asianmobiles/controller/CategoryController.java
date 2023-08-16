package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Category;
import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.repository.CategoryRepository;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/category")
public class CategoryController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private CategoryRepository categoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Category> findAll (){

        return categoryDao.findAll();

    }

}
