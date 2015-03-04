<?php

include './classes/Auth.class.php';
include './classes/AjaxRequest.class.php';

if (!empty($_COOKIE['sid'])) {
    // check session id in cookies
    session_id($_COOKIE['sid']);
}
session_start();

class AuthorizationAjaxRequest extends AjaxRequest
{
    public $actions = array(
        "login" => "login",
        "logout" => "logout",
        "register" => "register",
        "profile" => "profile",
    );

    public function login()
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            // Method Not Allowed
            http_response_code(405);
            header("Allow: POST");
            $this->setFieldError("main", "Method Not Allowed");
            return;
        }
        setcookie("sid", "");

        $email = $this->getRequestParam("email");
        $password = $this->getRequestParam("password");
        $remember = !!$this->getRequestParam("remember-me");

        if (empty($email)) {
            $this->setFieldError("email", "Введите Email");
            return;
        }

        if (empty($password)) {
            $this->setFieldError("password", "Введите пароль");
            return;
        }

        $user = new Auth\User();
        $auth_result = $user->authorize($email, $password, $remember);

        if (!$auth_result) {
            $this->setFieldError("password", "Неправильное имя пользователя или пароль");
            return;
        }

        $this->status = "ok";
        $this->setUserData($user->getAuthorizedUserInfo());
        $this->setResponse('redirect', '.');
        $this->message = sprintf("Hello, %s! Access granted.", $email);
    }
    public function profile () {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            // Method Not Allowed
            http_response_code(405);
            header("Allow: POST");
            $this->setFieldError("main", "Method Not Allowed");
            return;
        }
        if(empty($_SESSION["user_id"])) {
            $this->setFieldError("session", "No session on the server");
            return;
        }
        $user = new Auth\User();

        $this->status = "ok";
        $role = 'user';
        if($_SESSION['is_admin']) $role = 'admin';
        $this->setUserData(array(
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'url' => $_SESSION['url_name'],
            'role' => $role
        ));
        //$this->setResponse('redirect', '.');
        //$this->message = sprintf("Hello, %s! Access granted.");
    }
    public function logout()
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            // Method Not Allowed
            http_response_code(405);
            header("Allow: POST");
            $this->setFieldError("main", "Method Not Allowed");
            return;
        }

        setcookie("sid", "");

        $user = new Auth\User();
        $user->logout();

        $this->setResponse("redirect", ".");
        $this->status = "ok";
    }

    public function register()
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            // Method Not Allowed
            http_response_code(405);
            header("Allow: POST");
            $this->setFieldError("main", "Method Not Allowed");
            return;
        }

        setcookie("sid", "");

        $username = $this->getRequestParam("username");
        $URLName = $this->getRequestParam("urlname");
        $email = $this->getRequestParam("email");
        $password1 = $this->getRequestParam("password");
        $password2 = $password1; //$this->getRequestParam("password2");

        if (empty($URLName)) {
            $this->setFieldError("urlname", "Введите ссылку на профиль");
            return;
        }

        if (empty($username)) {
            $this->setFieldError("username", "Введите имя");
            return;
        }

        if (empty($email)) {
            $this->setFieldError("email", "Введите Email");
            return;
        }

        if (empty($password1)) {
            $this->setFieldError("password", "Введите пароль");
            return;
        }

        if (empty($password2)) {
            $this->setFieldError("password2", "Подтвердите пароль");
            return;
        }

        if ($password1 !== $password2) {
            $this->setFieldError("password2", "Пароли не совпадают");
            return;
        }

        $user = new Auth\User();

        try {
            $new_user_id = $user->create($username, $URLName, $email, $password1);
        } catch (\Exception $e) {
            $this->setFieldError("username", $e->getMessage());
            return;
        }
        $user->authorize($email, $password1);

        $this->message = sprintf("Hello, %s! Thank you for registration.", $username);
        $this->setResponse("redirect", $URLName);
        $this->status = "ok";
    }
}

$ajaxRequest = new AuthorizationAjaxRequest($_REQUEST);
$ajaxRequest->showResponse();
