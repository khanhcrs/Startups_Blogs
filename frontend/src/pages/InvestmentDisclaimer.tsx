import styles from './InvestmentDisclaimer.module.css';

const InvestmentDisclaimer = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.contentCard}>
          <h1 className={styles.title}>Investment Disclaimer</h1>
          <p className={styles.updatedDate}>Last updated: July 2024</p>
          
          <div className={styles.section}>
            <h2>1. Platform Purpose</h2>
            <p>
              Startups Blogs is an information and connection platform designed to facilitate interactions between businesses, 
              entrepreneurs and users. Startups Blogs does not guarantee funding, investment returns, 
              or successful business partnerships.
            </p>
          </div>

          <div className={styles.section}>
            <h2>2. No Financial, Legal, or Investment Advice</h2>
            <p>
              All content, profiles, funding opportunities, and materials displayed on Startups Blogs are for informational 
              purposes only and should not be construed as investment, legal, financial, or tax advice. Users are strongly 
              advised to perform their own due diligence and consult with licensed professional advisors prior to entering into 
              any financial or contractual agreements.
            </p>
          </div>

          <div className={styles.section}>
            <h2>3. Direct Negotiations</h2>
            <p>
              All conversations, negotiations, and agreements are conducted directly between the respective parties. 
              Startups Blogs is not a party to any transaction, does not act as a broker-dealer, financial institution, or legal representative, 
              and assumes no responsibility or liability for outcomes resulting from connections made through the platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Accuracy of Information</h2>
            <p>
              While Startups Blogs strives to maintain quality standards across listed businesses and opportunities, we do not 
              independently verify or guarantee the completeness, accuracy, or authenticity of user-submitted information or financial data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDisclaimer;
