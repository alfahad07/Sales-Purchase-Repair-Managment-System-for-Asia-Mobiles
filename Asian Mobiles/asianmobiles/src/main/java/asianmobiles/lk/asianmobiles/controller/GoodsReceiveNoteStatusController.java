package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CustomerStatus;
import asianmobiles.lk.asianmobiles.entity.GoodsReceiveNote;
import asianmobiles.lk.asianmobiles.entity.GoodsReceiveNoteStatus;
import asianmobiles.lk.asianmobiles.repository.CustomerStatusRepository;
import asianmobiles.lk.asianmobiles.repository.GoodsReceiveNoteStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/goodsreceivenotestatus")
public class GoodsReceiveNoteStatusController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private GoodsReceiveNoteStatusRepository goodsReceiveNoteStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<GoodsReceiveNoteStatus> findAll (){

        return goodsReceiveNoteStatusDao.findAll();

    }

}
