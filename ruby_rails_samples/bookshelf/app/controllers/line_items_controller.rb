class LineItemsController < ApplicationController
  def create    
    book = Book.find(params[:book_id])
    @cart = current_cart    
    #line_item = cart.line_items.build(:book_id => book.id)
    line_item = @cart.add_book(book.id)
    
    if line_item.save
      respond_to do |format|
        format.js
      end
    else
      redirect_to root_url, [notice: "Failed to add a book"]
    end
  end 
end
