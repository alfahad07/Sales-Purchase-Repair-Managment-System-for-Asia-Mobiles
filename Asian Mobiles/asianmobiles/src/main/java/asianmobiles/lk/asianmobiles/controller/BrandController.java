package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.Category;
import asianmobiles.lk.asianmobiles.entity.SubCategory;
import asianmobiles.lk.asianmobiles.repository.BrandRepository;
import asianmobiles.lk.asianmobiles.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/brand")
public class BrandController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private BrandRepository brandDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Brand> findAll (){

        return brandDao.findAll();

    }


    //GET MAPPING to get brand by given CategoryId for filtering [/brand/listbycategory?cid=]
    @GetMapping(value = "/listbycategory/{cid}", produces = "application/json")
    public List<Brand> brandListByCategory(@PathVariable("cid") Integer cid) {

        return brandDao.findByCategory(cid);

    }

    //GET MAPPING to get brand by given SubCategoryId for filtering [/brand/listbysubcategory?cid=]
    @GetMapping(value = "/listbysubcategory/{cid}", produces = "application/json")
    public List<Brand> brandListBySubCategory(@PathVariable("cid") Integer cid) {

        return brandDao.findBySubCategory(cid);

    }

}
