package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.GoodsReceiveNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface GoodsReceiveNoteRepository extends JpaRepository<GoodsReceiveNote,Integer> {

    //TO GET THE LAST GoodsReceiveNote Code WHICH IS USED IN ADD METHOD IN "GoodsReceiveNoteRequestController" TO SET THE NEXT GoodsReceiveNote Code NUMBER...
    @Query(value = "select max(grn.grn_code) from GoodsReceiveNote grn")
    String getLastGrnNo();

    @Query(value = "select new GoodsReceiveNote (grn.id, grn.grn_code) from GoodsReceiveNote grn")
    List<GoodsReceiveNote> list();

    @Query(value = "select grn from GoodsReceiveNote grn where grn.supplier_id.id = ?1 and grn.goods_receive_note_status_id.id = 1")
    List<GoodsReceiveNote> getGrnCodeBySupplier(Integer sid);

    @Query(value = "select grn from GoodsReceiveNote grn where grn.id = ?1 and grn.goods_receive_note_status_id.id = 1")
    GoodsReceiveNote getGrnNetTotalByGrn(Integer gid);


}
