import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FormRadiobutton } from '../FormRadiobutton';
import { MainButton } from '../MainButton';
import styles from './FormSection.module.scss';
import classNames from 'classnames';
import { FormInput } from '../FormInput';
import apiService from '../../services/api';

enum Positions {
  FrontendDev = 'Frontend developer',
  BackendDev = 'Backend developer',
  Design = 'Designer',
  QA = 'QA',
}

const MAX_FILE_SIZE_KB = 5 * 1024;

const positionValues = {
  [Positions.QA]: 1,
  [Positions.BackendDev]: 2,
  [Positions.FrontendDev]: 3,
  [Positions.Design]: 4
}

const nameValidation = (value: string): string => {
  const regex = /^[A-Z ]{2,60}$/i;

  if (!regex.test(value)) {
    return 'Name is not valid';
  }

  return '';
};

const emailValidation = (value: string): string => {
  const RFC2822 = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

  if (!RFC2822.test(value)) {
    return 'Email is not valid';
  }

  return '';
};

const phoneValidation = (value: string): string => {
  const regex = /^[+]{0,1}380([0-9]{9})$/;

  if (!regex.test(value)) {
    return 'Phone is not valid';
  }

  return '';
};

interface Props {
  setIsUserCreated: (val: boolean) => void,
}

export const FormSection: React.FC<Props> = ({ setIsUserCreated }) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const [position, setPosition] = useState<Positions>(Positions.FrontendDev);
  const [photo, setPhoto] = useState<File>();

  useEffect(() => {
    if (!nameError && !emailError && !phoneError && !photoError) {
      setIsFormValid(true);
    }

  }, [nameError, emailError, phoneError, photoError]);

  const handleSetName = (newVal: string) => {
    setName(newVal);
    setNameError(nameValidation(newVal));
  }

  const handleSetEmail = (newVal: string) => {
    setEmail(newVal);
    setEmailError(emailValidation(newVal));
  }

  const handleSetPhone = (newVal: string) => {
    setPhone(newVal);
    setPhoneError(phoneValidation(newVal));
  }

  const handlePositionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value as Positions);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      const photo = event.target.files[0];

      if (photo.size > MAX_FILE_SIZE_KB * 1024) {
        setPhoto(undefined);
        setPhotoError(`Max photo size is ${MAX_FILE_SIZE_KB} KB`);
        
        return;
      }

      setPhoto(photo)
      setPhotoError('');
    } else {
      setPhoto(undefined);
      setPhotoError('Select photo');
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameValidationError = nameValidation(name);
    const emailValidationError = emailValidation(email);
    const phoneValidationError = phoneValidation(phone);
    const photoValidationError = !photo ? 'Select photo': '';

    if (
      nameValidationError
      || emailValidationError
      || phoneValidationError
      || photoValidationError
    ) {
      setNameError(nameValidationError);
      setEmailError(emailValidationError);
      setPhoneError(phoneValidationError);
      setPhotoError(photoValidationError);
      setIsFormValid(false);

      return
    }

    if (photo) {
      apiService.createUser({
        position_id: positionValues[position],
        name,
        email,
        phone,
        photo,
      }).then(success => {
        if (success) {
          setIsUserCreated(true)
        }
      });
    }
  };

  return (
    <section className={classNames(
      styles.container,
      styles.section,
      styles.section__form,
    )}>
      <h2 className={styles.section__title}>
        Working with POST request
      </h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div>
          <div className={styles.form__field}>
            <FormInput
              id='name'
              name='name'
              type='text'
              value={name}
              setter={handleSetName}
              label='Your name'
              helper=''
              validationError={nameError}
            />
          </div>

          <div className={styles.form__field}>
            <FormInput
              id='email'
              name='email'
              type='text'
              value={email}
              setter={handleSetEmail}
              label='Email'
              helper=''
              validationError={emailError}
            />
          </div>

          <div className={styles.form__field}>
            <FormInput
              id='phone'
              name='phone'
              type='text'
              value={phone}
              setter={handleSetPhone}
              label='Phone'
              helper='+380 (XX) XXX - XX - XX'
              validationError={phoneError}
            />
          </div>
        </div>

        <fieldset className={styles.form__ragiogroup}>
          <legend className={styles['form__ragiogroup-legend']}>Select your position</legend>

          <div className={styles['form__ragiogroup-item']}>
            <FormRadiobutton
              id='frontend-developer'
              name='position'
              value={Positions.FrontendDev}
              handleChange={handlePositionChange}
              checked={Positions.FrontendDev === position}
            />
          </div>

          <div className={styles['form__ragiogroup-item']}>
            <FormRadiobutton
              id='backend-developer'
              name='position'
              value={Positions.BackendDev}
              handleChange={handlePositionChange}
              checked={Positions.BackendDev === position}
            />
          </div>

          <div className={styles['form__ragiogroup-item']}>
            <FormRadiobutton
              id='designer'
              name='position'
              value={Positions.Design}
              handleChange={handlePositionChange}
              checked={Positions.Design === position}
            />
          </div>

          <div className={styles['form__ragiogroup-item']}>
            <FormRadiobutton
              id='qa'
              name='position'
              value={Positions.QA}
              handleChange={handlePositionChange}
              checked={Positions.QA === position}
            />
          </div>
        </fieldset>
        
        <div className={styles['form__file-box']}>
          <input
            className={classNames(
              styles.form__input,
              styles['form__file-input'],
            )}
            id='photo'
            type='file'
            accept='.jpeg, .jpg'
            name='photo'
            placeholder='Upload your photo'
            onChange={handlePhotoChange}
          />
          <label
            className={classNames(
              styles['form__file-label'],
              { 
                [styles['form__file-label--empty']]: !photo,
                [styles['form__file-label--error']]: !!photoError,
              }
            )}
            htmlFor='photo'
          >
            { photo
              ? photo.name
              : 'Upload your photo'
            }
          </label>
        </div>

        <p
          className={classNames(
            styles['form__file-helper'],
            { [styles['form__file-helper--error']]: !!photoError }
          )}
        >
          {photoError}
        </p>

        <div className={styles.form__submit}>
          <MainButton
            type='submit'
            disabled={!isFormValid}
          >
            Sign up
          </MainButton>
        </div>
      </form>
    </section>
  )
}