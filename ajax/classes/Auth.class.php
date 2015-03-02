<?php

namespace Auth;

class User
{
    private $id;
    private $email;
    private $db;
    private $db_host = "localhost";
    private $db_name = "lovecanvas";
    private $db_user = "root";
    private $db_pass = "TwofRag83";

    private $is_authorized = false;

    private $user_id;
    private $is_admin;
    private $user_name;
    private $url_name;

    public function __construct($email = null, $password = null)
    {
        $this->email = $email;
        $this->connectDb($this->db_name, $this->db_user, $this->db_pass, $this->db_host);
    }

    public function __destruct()
    {
        $this->db = null;
    }

    public static function isAuthorized()
    {
        if (!empty($_SESSION["user_id"])) {
            return (bool) $_SESSION["user_id"];
        }
        return false;
    }

    public function passwordHash($password, $salt = null, $iterations = 10)
    {
        $salt || $salt = uniqid();
        $hash = md5(md5($password . md5(sha1($salt))));

        for ($i = 0; $i < $iterations; ++$i) {
            $hash = md5(md5(sha1($hash)));
        }

        return array('hash' => $hash, 'salt' => $salt);
    }

    public function getSalt($email) {
        $query = "select salt from users where email = :email limit 1";
        $sth = $this->db->prepare($query);
        $sth->execute(
            array(
                ":email" => $email
            )
        );
        $row = $sth->fetch();
        if (!$row) {
            return false;
        }
        return $row["salt"];
    }

    public function getURLName($URLName) {
        $query = "select urlname from users where urlname = :urlname limit 1";
        $sth = $this->db->prepare($query);
        $sth->execute(
            array(
                ":urlname" => $URLName
            )
        );
        $row = $sth->fetch();
        if (!$row) {
            return false;
        }
        return $row["urlname"];
    }

    public function authorize($email, $password, $remember=false)
    {
        $query = "select id, username, urlname, email, admin from users where
                  email = :email and password = :password limit 1";
        $sth = $this->db->prepare($query);
        $salt = $this->getSalt($email);

        if (!$salt) {
            return false;
        }

        $hashes = $this->passwordHash($password, $salt);
        $sth->execute(
            array(
                ":email"    => $email,
                ":password" => $hashes['hash'],
            )
        );
        $this->user = $sth->fetch();
        
        if (!$this->user) {
            $this->is_authorized = false;
        } else {
            $this->is_authorized = true;
            $this->user_id = $this->user['id'];
            $this->user_name = $this->user['username'];
            $this->url_name = $this->user['urlname'];
            $this->is_admin = $this->user['admin'];
            $this->saveSession($remember);
        }

        return $this->is_authorized;
    }
    public function getAuthorizedUserInfo (){
        if (!$this->is_authorized) return;
        $role = 'user';
        if($this->is_admin) $role = 'admin';
        return array(
            'id' => $this->user_id,
            'name' => $this->user_name,
            'url' => $this->url_name,
            'role' => $role
        );
    }
    public function logout()
    {
        if (!empty($_SESSION["user_id"])) {
            unset($_SESSION["user_id"]);
            unset($_SESSION["user_name"]);
            unset($_SESSION["url_name"]);
            unset($_SESSION["is_admin"]);
        }
    }

    public function saveSession($remember = false, $http_only = false, $days = 7)
    {
        $_SESSION["user_id"] = $this->user_id;
        $_SESSION["user_name"] = $this->user_name;
        $_SESSION["url_name"] = $this->url_name;
        $_SESSION["is_admin"] = $this->is_admin;

        if ($remember) {
            // Save session id in cookies
            $sid = session_id();

            $expire = time() + $days * 24 * 3600;
            $domain = ""; // default domain
            $secure = false;
            $path = "/";

            $cookie = setcookie("sid", $sid, $expire, $path, $domain, $secure, $http_only);
        }
    }

    public function create($username, $URLName, $email, $password) {
        $user_exists = $this->getSalt($email);
        $URL_exists = $this->getURLName($URLName);

        if ($user_exists) {
            throw new \Exception("User exists: " . $email, 1);
        }

        if ($URL_exists) {
            throw new \Exception("URL already exists: " . $URL_exists, 1);
        }

        $query = "insert into users (username, urlname, email, password, salt)
            values (:username, :urlname, :email, :password, :salt)";
        $hashes = $this->passwordHash($password);
        $sth = $this->db->prepare($query);

        try {
            $this->db->beginTransaction();
            $result = $sth->execute(
                array(
                    ':username' => $username,
                    ':urlname' => $URLName,
                    ':email' => $email,
                    ':password' => $hashes['hash'],
                    ':salt' => $hashes['salt'],
                )
            );
            $this->db->commit();
        } catch (\PDOException $e) {
            $this->db->rollback();
            echo "Database error: " . $e->getMessage();
            die();
        }

        if (!$result) {
            $info = $sth->errorInfo();
            printf("Database error %d %s", $info[1], $info[2]);
            die();
        } 

        return $result;
    }

    public function connectdb($db_name, $db_user, $db_pass, $db_host = "localhost")
    {
        try {
            $this->db = new \pdo("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
        } catch (\pdoexception $e) {
            echo "database error: " . $e->getmessage();
            die();
        }
        $this->db->query('set names utf8');

        return $this;
    }
}
