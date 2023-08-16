package asianmobiles.lk.asianmobiles.service;

import asianmobiles.lk.asianmobiles.entity.Role;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Transactional
@Service // THIS ANNOTATION IS USED TO DECLARE THE CLASS AS SERVICE CLASS BECAUSE THIS CLASS RETURNS A SERVICE...

public class MyUserDetailService implements UserDetailsService {

    @Autowired //THIS ANNOTATION IS USED TO CREATE INSTANCES OR COPIES OF CLASSES AND INTERFACES
    private UserRepository userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{

        User loggedUser = userDao.findUserByUsername(username);

        if(loggedUser != null){

            Set<GrantedAuthority> UserGranteset = new HashSet<>();
            for (Role role : loggedUser.getRole()){

                UserGranteset.add(new SimpleGrantedAuthority(role.getName()));

            }

            List<GrantedAuthority> authorities = new ArrayList<>(UserGranteset);

            return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(), loggedUser.getPassword(),
                    loggedUser.getStatus(), true, true, true, authorities);

        }else {

            List<GrantedAuthority> authorities = new ArrayList<>();

            return new org.springframework.security.core.userdetails.User("none", "none", false,
                    true, true, true, authorities);

        }

    }

}
