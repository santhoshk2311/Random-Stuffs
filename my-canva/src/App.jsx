import './App.css'

function App() {
  return (
    <div className="app">
      <h1>My canva</h1>
      <form className="content-form">
        <label>
          Title
          <input type="text" name="title" placeholder="Enter title" />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="4"
            placeholder="Enter description"
          />
        </label>

        <label>
          Image
          <input type="file" name="img" accept="image/*" />
        </label>

        <fieldset>
          <legend>Footer</legend>
          <label>
            Date
            <input type="text" name="footerDate" placeholder="Enter date" />
          </label>
          <label>
            Time
            <input type="text" name="footerTime" placeholder="Enter time" />
          </label>
        </fieldset>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App
