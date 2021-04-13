import { resolveSrv } from 'dns';
import * as Nedb from 'nedb';
import { User } from '../Shared/Model';

export class UsersDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/Users.db');
    this.nedb.loadDatabase();
  }

  public async putUser(user: User) {
    if(!user.id){
      user.id = this.generateUserId();
    }
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, (err: Error | null, docs: User) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUserById(userId: string | undefined): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find(
        { _id: userId },
        (error: Error, docs: any[]) => {
          if (error) {
            reject(error);
          } else {
            if(docs.length == 0){
              resolve(undefined);
            } else {
              resolve(docs[0]);
            }
          }
        }
      );
    });
  }

  public async deleteUser(userId: string): Promise<boolean>{
    const operationSuccess = await this.deleteUserFromDb(userId);
    this.nedb.loadDatabase();
    return operationSuccess;
  }

  private async deleteUserFromDb(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.nedb.remove(
        { id: userId },
        (error: Error | null, numRemoved: number) => {
          if (error) {
            reject(error);
          } else {
            if(numRemoved == 0){
              resolve(false);
            } else {
              resolve(true);
            }
          }
        }
      );
    });
  }

  public async getUsersByName(name: string): Promise<User[]> {
    const regEX = new RegExp(name);
    return new Promise((resolve, reject) => {
      this.nedb.find(
        { name: regEX },
        (error: Error, docs: any[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(docs);
          }
        }
      );
    });
  }

  private generateUserId(){
    return Math.random().toString(36).slice(2);
  }
}
