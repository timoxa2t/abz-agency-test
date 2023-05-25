import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FormRadiobutton } from '../FormRadiobutton';
import { MainButton } from '../MainButton';
import styles from './FormSection.module.scss';
import classNames from 'classnames';
import { FormInput } from '../FormInput';
import apiService from '../../services/api';
import { Position } from '../../types/Position';
import { Loader } from '../Loader';


const MAX_FILE_SIZE_KB = 5 * 1024;

const nameValidation = (value: string): string => {
  const regex = /^[A-Z ]{2,60}$/i;

  if (!regex.test(value)) {
    return 'Name is not valid';
  }

  return '';
};

const emailValidation = (value: string): string => {
  // eslint-disable-next-line no-control-regex
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
  const [isLoading, setIsloading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const [positions, setPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<string>();
  const [photo, setPhoto] = useState<File>();

  useEffect(() => {
    apiService.getPositions()
      .then(positionsData => {
        setPositions(positionsData);
        
        if (positionsData.length > 0) {
          setPosition(positionsData[0].name);
        }
      })
  }, []);

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
    setPosition(event.target.value);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      const photo = event.target.files[0];

      if (photo.size > MAX_FILE_SIZE_KB * 1024) {
        setPhoto(undefined);
        setPhotoError(`Max photo size is ${MAX_FILE_SIZE_KB} KB`);
        
        return;
      }


      let img: HTMLImageElement;
      const fr = new FileReader();

      const imageLoaded = () => {
        if (img.width < 70 || img.height < 70) {
          setPhoto(undefined);
          setPhotoError('Minimum size is 70x70 px');
        }

      }

      const createImage = () => {
        img = document.createElement('img'); 
        img.onload = imageLoaded;
        img.style.display = 'none'; 
        if (typeof fr.result === 'string') {
          img.src = fr.result;
          document.body.appendChild(img);
        }
      } 

      fr.onload = createImage;
      fr.readAsDataURL(photo);

      setPhoto(photo)
      setPhotoError('');      
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

    const posId = positions.find(pos => pos.name === position)?.id || 0;

    if (photo) {
      setIsloading(true);
      apiService.createUser({
        position_id: posId,
        name,
        email,
        phone,
        photo,
      }).then(success => {
        if (success) {
          setIsUserCreated(true)
        }
      }).catch(err => {
        if (err.response.status === 409) {
          setEmailError(err.response.data.message);
          setPhoneError(err.response.data.message);
        }
      }).finally(() => {
        setIsloading(false);
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

          {positions.map(({ name, id }) => (
            <div key={id} className={styles['form__ragiogroup-item']}>
              <FormRadiobutton
                id={id.toString()}
                name='position'
                value={name}
                handleChange={handlePositionChange}
                checked={name === position}
              />
            </div>
          ))}
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
          {isLoading
            ? <Loader />
            : (
              <MainButton
                type='submit'
                disabled={!isFormValid}
              >
                Sign up
              </MainButton>
            )}
        </div>
      </form>
    </section>
  )
}