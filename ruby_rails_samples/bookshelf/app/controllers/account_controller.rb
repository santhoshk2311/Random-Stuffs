class AccountController < ApplicationController
  def new
    
  end

  def create
    if user = User.authenticate(params[:name], params[:password])
      session[:user_id] = user.id
      redirect_to books_url
    else
      redirect_to '/login', alert: 'Bad username or password'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/login'
  end
end
