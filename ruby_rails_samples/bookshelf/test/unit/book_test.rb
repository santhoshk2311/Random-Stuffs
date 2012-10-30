require 'test_helper'

class BookTest < ActiveSupport::TestCase
  def test_book_attributes_presence 
    book = Book.new
    assert book.invalid?
    assert book.errors[:title].any?
    assert book.errors[:description].any?
  end
  
  def test_book_price
    book = Book.new(:title=>"one",
    :description=>"one",
    :image_url=>"one.png")
    book.price = -1
    assert book.invalid?
    assert_equal "must be greater than or equal to 0.01", book.errors[:price].join('; ')
    book.price = 1
    assert book.valid?
  end
  
  def test_book_unique_title
    book = Book.new(:title=>books(:ruby).title)
    assert book.invalid?
    assert_equal "has already been taken", book.errors[:title].join('; ')
  end
end
