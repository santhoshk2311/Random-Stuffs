class AddBooks < ActiveRecord::Migration
  def up
    Book.create(
    :title => 'Agile web development',
    :description => 'really good book',
    :image_url => 'agile.png',
    :price => 12.99
    )
    Book.create(
    :title => 'Agile web development 2',
    :description => 'really good book',
    :image_url => 'agile2.png',
    :price => 12.99
    )
  end

  def down
    Book.delete_all
  end
end
