import React from 'react'
import DailyActivities from './DailyActivities'
import DailyTransactions from './DailyTransactions'
import OverviewCard from './Utils/OverviewCard'
import Layout from './Layout'
import './Styles.css'
const Reports = () => {
  return (
    <>
      <Layout>
        <OverviewCard className='reportMargin'/>
        <DailyTransactions className='reportMargin'/>
        <DailyActivities className='reportMargin'/>
      </Layout>
    </>
  )
}

export default Reports
