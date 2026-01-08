import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../Modal/Modal'
import { Upload, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import './Newsletter.css'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const BASE_URL = 'https://exodus-va6e.onrender.com'

const Newsletter = () => {
  const [subscriptionsList, setSubscriptionsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: '',
    message: '',
    subMessage: '',
    type: '',
  })

  // Fetch all subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/newsletter/subscriptions`)
        setSubscriptionsList(res.data || [])
      } catch (error) {
        console.error(error)
        setModalInfo({
          show: true,
          title: 'Error!',
          message: 'Failed to fetch newsletter subscriptions.',
          subMessage: '',
          type: 'error',
        })
      }
    }

    fetchSubscriptions()
  }, [])

  // Pagination
  const totalPages = Math.ceil(subscriptionsList.length / itemsPerPage)

  const paginatedList = subscriptionsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  // Export to Excel
  const exportSubscribersToExcel = () => {
    if (subscriptionsList.length === 0) {
      setModalInfo({
        show: true,
        title: 'No Data',
        message: 'There are no subscribers to export.',
        subMessage: '',
        type: 'info',
      })
      return
    }

    const formattedData = subscriptionsList.map(sub => ({
      Email: sub.email,
      Subscribed_At: new Date(sub.subscribed_at).toLocaleString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscribers')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const file = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    })

    saveAs(file, 'newsletter_subscribers.xlsx')
  }

  return (
    <div className="subscription-container">
      {modalInfo.show && (
        <Modal
          title={modalInfo.title}
          message={modalInfo.message}
          subMessage={modalInfo.subMessage}
          type={modalInfo.type}
          onClose={() => setModalInfo(prev => ({ ...prev, show: false }))}
        />
      )}
      {/* Card */}
      <div className="dashboard-card" style={{marginLeft:'3vw'}}>
        <div className="card-icon">
          <Mail size={24} />
        </div>
        <h3>Newsletter Subscribers</h3>
        <p>{subscriptionsList.length}</p>
        <span className="hr-span"></span>
        <button onClick={exportSubscribersToExcel}>
          Download Report
        </button>
      </div>

      {/* List */}
      <div className="newsletter-list">
        <h3 style={{ margin: '72px 0 12px 4vw', color: '#fff' }}>
          List of Subscribers: {subscriptionsList.length}
        </h3>

        <div className="notification-list">
          {paginatedList.length > 0 ? (
            paginatedList.map((sub, index) => (
              <div key={index}>
                <p style={{ fontWeight: 500 }}>{sub.email}</p>
                <hr className="notification-hr" />
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.6 }}>No subscribers found yet.</p>
          )}
        </div>

        {/* Pagination */}
        {subscriptionsList.length > itemsPerPage && (
          <div
            className="pagination-controls"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ color: '#ccc' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter
