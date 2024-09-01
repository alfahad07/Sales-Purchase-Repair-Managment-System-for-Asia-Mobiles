package asianmobiles.lk.asianmobiles.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration // THIS ANNOTATION IS USED TO DECLARE THE CLASS AS CONFIGURATION CLASS BECAUSE THIS CLASS RETURNS A CONFIGURATION( SECURITY )...
@EnableWebSecurity

public class WebSecurity {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http.authorizeRequests().
                antMatchers("/Assets/**").permitAll(). //Giving permission to the Assets File resource --> static file
                antMatchers("/createadmin").permitAll().
                antMatchers("/login").permitAll().
                antMatchers("/dashboard").hasAnyAuthority("Admin","Owner","Manager","Cashier","Ass_Manager","Technician","Sales_Person").
                antMatchers("/employee/**").hasAnyAuthority("Admin","Owner","Manager").
                antMatchers("/user/**").hasAnyAuthority("Admin","Owner","Manager").
                antMatchers("/privilage/**").hasAnyAuthority("Admin","Owner","Manager").
                antMatchers("/grnReports").hasAnyAuthority("Admin","Owner","Manager","Ass_Manager").
                anyRequest().authenticated().and().csrf().disable().

                formLogin().
                      loginPage("/login").
                      usernameParameter("username").
                      passwordParameter("password").
                      defaultSuccessUrl("/dashboard",true).
                      failureUrl("/login?error=usernamepassworderror").and().

                logout().
                      logoutRequestMatcher(new AntPathRequestMatcher("/logout")).
                      logoutSuccessUrl("/login").and().

                exceptionHandling().accessDeniedPage("/404");


        return http.build();

    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){

        return new BCryptPasswordEncoder();

    }

}
