# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Book.delete_all

Book.create(
  :title => 'Agile Web Development with Rails',
  :description =>
    %{
Ruby on Rails helps you produce high-quality, beautiful-looking web applications quickly. You concentrate on creating the application, and Rails takes care of the details.
  },
  :image_url => 'agile_web_development_with_rails.jpg',
  :price => 43.95,
  :discount_price => 26.12
)

Book.create(
  :title => 'The Ruby Programming Language',
  :description =>
    %{
This book begins with a quick-start tutorial to the language, and then explains the language in detail from the bottom up: from lexical and syntactic structure to datatypes to expressions and statements and on through methods, blocks, lambdas, closures, classes and modules.
  },
  :image_url => 'the_ruby_programming_language.jpg',
  :price => 39.99,
  :discount_price => 23.83
)

Book.create(
  :title => 'PHP and MySQL Web Development',
  :description =>
    %{
The PHP server-side scripting language and the MySQL database management system (DBMS) make a potent pair. Both are open-source products--free of charge for most purposes--remarkably strong, and capable of handling all but the most enormous transaction loads. Both are supported by large, skilled, and enthusiastic communities of architects, programmers, and designers.
  },
  :image_url => 'php_and_mysql_web_development.jpg',
  :price => 54.99,
  :discount_price => 32.55
)

Book.create(
  :title => 'PHP Solutions: Dynamic Web Design Made Easy',
  :description =>
    %{
This is the second edition of David Power's highly-respected PHP Solutions: Dynamic Web Design Made Easy. This new edition has been updated by David to incorporate changes to PHP since the first edition and to offer the latest techniques--a classic guide modernized for 21st century PHP techniques, innovations, and best practices.
  },
  :image_url => 'php_solution_dynamic_web_design_made_easy.jpg',
  :price => 44.99,
  :discount_price => 27.99
)

Book.create(
  :title => 'Effective Java',
  :description =>
    %{
Are you looking for a deeper understanding of the Java programming language so that you can write code that is clearer, more correct, more robust, and more reusable? Look no further! Effective Java, Second Edition, brings together seventy-eight indispensable programmer's rules of thumb: working, best-practice solutions for the programming challenges you encounter every day.
  },
  :image_url => 'effective_java.jpg',
  :price => 54.99,
  :discount_price => 37.89
)

Book.create(
  :title => 'Introduction to Java Programming, Comprehensive',
  :description =>
    %{
If you prefer your computer technology learning in textbook style, then this is an excellent choice in books... Introduction to Java Programming - Comprehensive Version (Sixth Edition) by Y. Daniel Liang. It's an entire college-level course in Java in one very big (and well-written) volume...
  },
  :image_url => 'introduction_to_java_programming_comprehensive.jpg',
  :price => 124.00,
  :discount_price => 99.22
)

Book.create(
  :title => 'Sams Teach Yourself Java in 24 Hours',
  :description =>
    %{
In just 24 lessons of one hour or less, you can learn how to create Java applications with the free NetBeans visual editing tools.
  },
  :image_url => 'sams_teach_yourself_java.jpg',
  :price => 17.59
)
