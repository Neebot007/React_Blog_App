import conf from '../conf/conf'
import {Account,Client,ID, Databases,Storage,Query} from 'appwrite'

export class Service{
    client=new Client();
    databases;
    bucket
    constructor(){
        this.client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId)
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    async createPost({title,slug,content,featuredImage,status,userId}){
        try{
            return await this.databases.createDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                status,
                userId
            })
        }
        catch(error){
            throw error;
        }

    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug,{
                title,
                content,
                featuredImage,
                status
            });
            
        } catch (error) {
            throw error;
            
        }

    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug);
            return true;
            
        } catch (error) {
            console.log("Error while deleting",error);
            return false;
            
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.appWriteDatabaseId,conf.appWriteCollectionId,slug);
            
        } catch (error) {
            console.log("Error while getting the post" ,error);
            return false;
        }
    }
    async getPosts(queries=[Query.equal("status","active")]){
        console.log("inside the getPosts");
        try {
            return await this.databases.listDocuments(conf.appWriteDatabaseId,conf.appWriteCollectionId,queries);
            
        } catch (error) {
            console.log("Error while geting all posts",error);
            return false;
        }
    }
    //upload files
    async uploadFile(file){
        try {
            return await this.bucket.createFile(conf.appWriteBucketId,ID.unique(),file)
            
        } catch (error) {
            console.log("Appwrite uplad file error",error);
            return false;
        }
    }
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(conf.appWriteBucketId,fileId);
            return true;
        } catch (error) {
            console.log("Error Delte file",error);
            return false;
            
        }
    }
    getFilePreview(fileId){
        const fileUrl=this.bucket.getFileView(conf.appWriteBucketId,fileId);
        console.log(fileUrl);
        return fileUrl;
    }

}
const service=new Service();
export default service;
