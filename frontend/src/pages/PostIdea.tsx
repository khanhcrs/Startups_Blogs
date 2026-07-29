import styles from './PostIdea.module.css';

const PostIdea = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Post Your Idea</h1>
        <p className={styles.subtitle}>Showcase to investors and partners.</p>

        <div className={styles.layout}>
          {/* Left Sidebar - Steps */}
          <div className={styles.sidebar}>
            <ul className={styles.stepList}>
              <li className={`${styles.stepItem} ${styles.activeStep}`}>
                <div className={styles.stepCircle}>1</div>
                <span>Basic Information</span>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepCircle}>2</div>
                <span>Problem & Solution</span>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepCircle}>3</div>
                <span>Product & Market</span>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepCircle}>4</div>
                <span>Team</span>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepCircle}>5</div>
                <span>Funding & Goals</span>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepCircle}>6</div>
                <span>Review & Submit</span>
              </li>
            </ul>
          </div>

          {/* Middle Form */}
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Basic Information</h2>
            <p className={styles.formDesc}>Tell us about your startup.</p>

            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Startup / Project Name <span>*</span></label>
                <input type="text" placeholder="Enter your startup name" />
              </div>

              <div className={styles.formGroup}>
                <label>Short Description <span>*</span></label>
                <input type="text" placeholder="One line summary of your idea" />
              </div>

              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label>Category <span>*</span></label>
                  <select>
                    <option>Select category</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Stage <span>*</span></label>
                  <select>
                    <option>Select stage</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Location <span>*</span></label>
                <input type="text" placeholder="Select location" />
              </div>

              <div className={styles.formGroup}>
                <label>Website (Optional)</label>
                <input type="text" placeholder="https://yourwebsite.com" />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn}>Cancel</button>
                <button type="button" className={styles.nextBtn}>Next Step</button>
              </div>
            </form>
          </div>

          {/* Right Tips */}
          <div className={styles.tipsContainer}>
            <h3>Tips</h3>
            <ul className={styles.tipsList}>
              <li>Be clear and concise about your idea.</li>
              <li>Use simple language everyone can understand.</li>
              <li>A great profile gets more attention from investors.</li>
            </ul>
            <div className={styles.illustration}>
              <img src="/images/post_idea_illustration.jpg" alt="Rocket launching from laptop" className={styles.tipsImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostIdea;
