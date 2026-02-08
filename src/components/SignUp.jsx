import React, { useState } from 'react'
import './SignUp.css'

function SignUp() {
  const [language, setLanguage] = useState('EN') // 'EN' or 'CN'
  const [userType, setUserType] = useState(null) // 'business' or 'influencer'
  const [preference, setPreference] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wechatIns: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Translations
  const translations = {
    EN: {
      header: {
        title: 'Join Our Marketplace',
        subtitle: 'Choose your role and preferences to get started'
      },
      userType: {
        label: 'I am a...',
        business: 'Brand / Business',
        influencer: 'Creator / Influencer'
      },
      businessPreference: {
        question: 'How would you like to connect with creators?',
        outbound: {
          title: 'Outbound Discovery',
          text: 'I want to reach out to creators directly via email or messages and wait for their response.'
        },
        inbound: {
          title: 'Inbound Collaboration',
          text: "I prefer creators to contact me when they're interested in working with my brand."
        }
      },
      influencerPreference: {
        question: 'How would you like to connect with brands?',
        proactive: {
          title: 'Proactive Outreach',
          text: 'I want to pitch brands with projects I believe can create mutual benefits.'
        },
        invitations: {
          title: 'Brand Invitations',
          text: "I'm open to brands reaching out with collaboration opportunities, though fit and compensation may vary."
        }
      },
      form: {
        infoLabel: 'Your Information',
        name: 'First Name',
        namePlaceholder: 'Enter your first name',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        wechatIns: 'WeChat / Instagram',
        wechatInsPlaceholder: 'Enter your WeChat or Instagram',
        submit: 'Sign Up'
      },
      success: {
        title: 'Thank you for signing up!',
        message: 'Your preferences have been saved.',
        another: 'Sign Up Another User'
      }
    },
    CN: {
      header: {
        title: '加入我们的市场',
        subtitle: '选择您的角色和偏好以开始'
      },
      userType: {
        label: '我是...',
        business: '品牌 / 企业',
        influencer: '创作者 / 影响者'
      },
      businessPreference: {
        question: '您希望如何与创作者联系？',
        outbound: {
          title: '主动发现',
          text: '我想通过电子邮件或消息直接联系创作者，并等待他们的回复。'
        },
        inbound: {
          title: '被动合作',
          text: '我更喜欢创作者在有兴趣与我的品牌合作时主动联系我。'
        }
      },
      influencerPreference: {
        question: '您希望如何与品牌联系？',
        proactive: {
          title: '主动推广',
          text: '我想向品牌推销我认为可以创造互惠互利的项目。'
        },
        invitations: {
          title: '品牌邀请',
          text: '我欢迎品牌主动联系我提供合作机会，尽管匹配度和报酬可能有所不同。'
        }
      },
      form: {
        infoLabel: '您的信息',
        name: '全名',
        namePlaceholder: '请输入您的全名',
        email: '电子邮件',
        emailPlaceholder: '请输入您的电子邮件',
        wechatIns: '微信 / Instagram',
        wechatInsPlaceholder: '请输入您的微信或Instagram',
        submit: '注册'
      },
      success: {
        title: '感谢您的注册！',
        message: '您的偏好已保存。',
        another: '注册另一个用户'
      }
    }
  }

  const t = translations[language]

  const getBusinessOptions = () => [
    {
      id: 'business-outbound',
      title: t.businessPreference.outbound.title,
      text: t.businessPreference.outbound.text,
      value: 'outbound_discovery'
    },
    {
      id: 'business-inbound',
      title: t.businessPreference.inbound.title,
      text: t.businessPreference.inbound.text,
      value: 'inbound_collaboration'
    }
  ]

  const getInfluencerOptions = () => [
    {
      id: 'influencer-proactive',
      title: t.influencerPreference.proactive.title,
      text: t.influencerPreference.proactive.text,
      value: 'proactive_outreach'
    },
    {
      id: 'influencer-invitations',
      title: t.influencerPreference.invitations.title,
      text: t.influencerPreference.invitations.text,
      value: 'brand_invitations'
    }
  ]

  const handleUserTypeSelect = (type) => {
    setUserType(type)
    setPreference(null)
  }

  const handlePreferenceSelect = (pref) => {
    setPreference(pref)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (userType && preference && formData.name && formData.email && formData.wechatIns) {
      setIsSubmitting(true)
      setError(null)

      try {
        // Use environment variable for API URL, fallback to localhost for development
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userType,
            preference,
            name: formData.name,
            email: formData.email,
            wechatIns: formData.wechatIns
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit form')
        }

        // Success - show success message
        setSubmitted(true)
      } catch (err) {
        console.error('Error submitting form:', err)
        setError(err.message || 'Failed to submit form. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleReset = () => {
    setUserType(null)
    setPreference(null)
    setFormData({ name: '', email: '', wechatIns: '' })
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="signup-container">
        <div className="success-message">
          <div className="language-switcher">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'CN' : 'EN')}
              className="lang-btn"
            >
              {language === 'EN' ? '中文' : 'EN'}
            </button>
          </div>
          <div className="success-icon">✓</div>
          <h2>{t.success.title}</h2>
          <p>{t.success.message}</p>
          <button onClick={handleReset} className="btn-secondary">
            {t.success.another}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="language-switcher">
          <button
            onClick={() => setLanguage(language === 'EN' ? 'CN' : 'EN')}
            className="lang-btn"
          >
            {language === 'EN' ? '中文' : 'EN'}
          </button>
        </div>
        <div className="signup-header">
          <h1>{t.header.title}</h1>
          <p>{t.header.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {/* User Type Selection */}
          <div className="form-section">
            <h2>{t.userType.label}</h2>
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${userType === 'business' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('business')}
              >
                <div className="user-type-icon">🏢</div>
                <div className="user-type-label">{t.userType.business}</div>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'influencer' ? 'active' : ''}`}
                onClick={() => handleUserTypeSelect('influencer')}
              >
                <div className="user-type-icon">⭐</div>
                <div className="user-type-label">{t.userType.influencer}</div>
              </button>
            </div>
          </div>

          {/* Preference Selection */}
          {userType && (
            <div className="form-section">
              <h2>
                {userType === 'business' 
                  ? t.businessPreference.question
                  : t.influencerPreference.question}
              </h2>
              <div className="preference-options">
                {(userType === 'business' ? getBusinessOptions() : getInfluencerOptions()).map((option) => (
                  <label
                    key={option.id}
                    className={`preference-option ${preference === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="preference"
                      value={option.value}
                      checked={preference === option.value}
                      onChange={() => handlePreferenceSelect(option.value)}
                    />
                    <div className="preference-content">
                      <span className="preference-title">{option.title}</span>
                      <span className="preference-text">{option.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          {userType && preference && (
            <div className="form-section">
              <h2>{t.form.infoLabel}</h2>
              <div className="input-group">
                <label htmlFor="name">{t.form.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t.form.namePlaceholder}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">{t.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t.form.emailPlaceholder}
                />
              </div>
              <div className="input-group">
                <label htmlFor="wechatIns">{t.form.wechatIns}</label>
                <input
                  type="text"
                  id="wechatIns"
                  name="wechatIns"
                  value={formData.wechatIns}
                  onChange={handleInputChange}
                  required
                  placeholder={t.form.wechatInsPlaceholder}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          {userType && preference && (
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (language === 'EN' ? 'Submitting...' : '提交中...') : t.form.submit}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default SignUp
