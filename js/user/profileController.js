app.controller('profileController', function ($scope, $rootScope, $state) {
    $scope.adminNav = [
        {
            title: 'Аккаунт',
            list:[
                {
                    name: 'Редактировать',
                    icon: 'icon-users-42',
                    link: 'edit',
                    isActive: false
                },{
                    name: 'Смена пароля',
                    icon: 'icon-edition-59',
                    link: 'password',
                    isActive: false
                }
            ]
        }/*,
        {
            title: 'Заказы',
            list: [
                {
                    name: 'История заказов',
                    icon: 'icon-users-42',
                    isActive: false
                }
            ]
        }*/
    ];
    $scope.$on('$stateChangeSuccess', function(event, toState){
        var urlName = toState.name.split('.')[1];
        changeActiveLink(false, urlName);
    });
    $scope.changeActiveLink = changeActiveLink;

    function changeActiveLink(list, link){
        if(typeof link === 'undefined') link = false;
        $scope.adminNav.forEach(function(item){
            item.list.forEach(function(itemOfList){
                itemOfList.isActive = link && link === itemOfList.link;
            })
        });
        if(link ) return;
        list.isActive = true;
    }

});