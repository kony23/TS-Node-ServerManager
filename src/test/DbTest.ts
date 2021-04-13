
import { UserCredentialsDBAccess } from "../Authorization/UserCreedentialsDBAccess";
import { UsersDBAccess } from "../User/UsersDBAccess";


class DbTest {
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    public userDbAccess: UsersDBAccess = new UsersDBAccess();
}

new DbTest().dbAccess.putUserCredential({
    username: 'user1',
    password: 'password1',
    accessRights: [0,1,2,3]
});

// new DbTest().userDbAccess.putUser({
//     age: 30,
//     email: 'some@email.com',
//     id: 'asd1234',
//     name: 'John Jay',
//     workingPosition: 3
// });