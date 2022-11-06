import React from 'react'
import DailyActivities from './DailyActivities'
import DailyTransactions from './DailyTransactions'
import OverviewCard from './Utils/OverviewCard'
import Layout from './Layout'

const Dashboard = () => {
  return (
    <>
      <Layout title='Daily Overview'>
        <OverviewCard />
      </Layout>
      <Layout title='Daily Transactions'>
        <DailyTransactions />
      </Layout>
      <Layout title='Daily Activities'>
        <DailyActivities />
      </Layout>
    </>
  )
}

export default Dashboard
