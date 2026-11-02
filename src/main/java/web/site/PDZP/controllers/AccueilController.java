package web.site.PDZP.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccueilController {
    @GetMapping("/")
    public String accueil(Model model){


        return "accueil/index";
    }

    @GetMapping("/sig")
    public String sig(){
        return "documentations/territoire";
    }

    @GetMapping("/pdzp")
    public String projet(){
        return "projet/le_projet";
    }

    @GetMapping("/pdzp/composante1")
    public String composante1(){
        return "projet/composante1";
    }

    @GetMapping("/pdzp/composante2")
    public String composante2(){
        return "projet/composante2";
    }

    @GetMapping("/pdzp/composante3")
    public String composante3(){
        return "projet/composante3";
    }

    @GetMapping("/phototech")
    public String phototeque(){
        return "realisations/phototeque";
    }

    @GetMapping("/publication")
    public String publication(){
        return "documentations/publication";
    }

    @GetMapping("/contact")
    public String contact(){
        return "accueil/contact";
    }

    @GetMapping("/actualite")
    public String actualite(){
        return "documentations/actualite";
    }
}


