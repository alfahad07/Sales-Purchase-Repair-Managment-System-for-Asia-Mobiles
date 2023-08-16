package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Category;
import asianmobiles.lk.asianmobiles.entity.SubCategory;
import asianmobiles.lk.asianmobiles.repository.CategoryRepository;
import asianmobiles.lk.asianmobiles.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/subcategory")
public class SubCategoryController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SubCategoryRepository subCategoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SubCategory> findAll() {

        return subCategoryDao.findAll();

    }

    //GET MAPPING to get SubCategory by given CategoryId for filtering [/subcategory/listbycategory?cid=]
    @GetMapping(value = "/listbycategory", params = "cid", produces = "application/json")
    public List<SubCategory> SubCategoryListByCategory(@RequestParam("cid") Integer cid) {

        return subCategoryDao.findByCategory(cid);

    }
}