class UsersController < ApplicationController
  def index
    @users = User.all
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to users_url
    else
      render "new"
    end
  end
  
  def picture
    user = User.find(params[:id])
    send_data(user.data,
            :type=>user.content_type,
            :disposition=>'inline')
  end
end
