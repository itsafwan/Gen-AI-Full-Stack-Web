

const Home = () => {
  return (
    <main className='Home'>

      <div className="left">
        <textarea name="jobDescription" id="jobDescription" placeholder='Enter job Description here'> </textarea>
      </div>

      <div className="right">

        <div className="input-group">
          <label htmlFor="resume">Upload Resume</label>
          <input type="file" name="resume" id="resume" accept=".pdf" />
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">Self Description</label>
          <textarea name="selfDescription" id="selfDescription" placeholder="Describe your self in a few sentence..."></textarea>
        </div>

        <button className="generate-button">Generate Interview Report</button>
      </div>
      
    </main>
  )
}

export default Home
