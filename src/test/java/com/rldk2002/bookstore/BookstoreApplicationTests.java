package com.rldk2002.bookstore;

import com.rldk2002.bookstore.configuration.JasyptConfiguration;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = { JasyptConfiguration.class })
class BookstoreApplicationTests {

    @Test
    void contextLoads() {
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword("canna");

        String key = encryptor.encrypt("3qzFsioWKGa5L_SWbqVB");
        String pswd = encryptor.encrypt("zk5T08UK_E");

//        System.out.println(key);
//        System.out.println(pswd);
        String interparkKey = encryptor.encrypt("1C8BCF6B8D5DC80DCC9A942E580D229298557FF81B5D47E079331532A8B5BAD1");
        System.out.println(interparkKey);
    }

    @Test
    void gggg() {
        try {
            Scanner scanner = new Scanner(new File("C:\\Users\\rldk2\\OneDrive\\Desktop\\categoryList.txt"));

            while (scanner.hasNext()) {
                String s = scanner.nextLine();
                String[] str = s.split("\\s");
                System.out.println(str[0] + ": \"" + str[1] + "\",");
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

    }

}
