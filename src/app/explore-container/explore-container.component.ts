import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  @Input() rate: number;
  @Input() rent: number;
  @Input() rentalExpenses: number;
  feeFirstYear: number = 0.3;
  feeSecondYear: number = 0.25;
  feeThirdYearAndAfter: number = 0.2;
  firstYearFees: number;
  secondYearFees: number;
  thirdYearAndAfterFees: number;
  incomesForOneYear: number;
  MonthlyIncome: number;
  annualReturn: number;
  monthlyIncomesArray: number[] = [];
  annualReturnsArray: number[] = [];
  display: boolean = false;

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  async onSubmitForm() {
    if (this.rate == undefined || this.rent == undefined || this.rentalExpenses == undefined) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Merci de remplir tous les champs du formulaire',
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      this.firstYearFees = (this.rent * 12) * this.feeFirstYear;
      this.secondYearFees = (this.rent * 12) * this.feeSecondYear;
      this.thirdYearAndAfterFees = (this.rent * 12) * this.feeThirdYearAndAfter;
      this.monthlyNetIncomes(this.firstYearFees);
      this.monthlyNetIncomes(this.secondYearFees);
      this.monthlyNetIncomes(this.thirdYearAndAfterFees);
      console.table(this.monthlyIncomesArray);
      this.mappingAnnualReturn(this.monthlyIncomesArray[0]);
      this.mappingAnnualReturn(this.monthlyIncomesArray[1]);
      this.mappingAnnualReturn(this.monthlyIncomesArray[2]);
      console.table(this.annualReturnsArray);
      this.display = true;

    }
  }

  monthlyNetIncomes(x) {
    this.incomesForOneYear = (this.rent * 12) -
      (this.rentalExpenses + x);
    this.MonthlyIncome = this.incomesForOneYear / 12;
    return this.monthlyIncomesArray.push(this.MonthlyIncome);
  }


  mappingAnnualReturn(x) {
    this.annualReturn = (x * 12 * 100) / this.rate;
    return this.annualReturnsArray.push(this.annualReturn);
  }
  emptyForm() {
    this.rate = null;
    this.rent = null;
    this.rentalExpenses = null;
    this.rentalExpenses = null;
    this.monthlyIncomesArray = [];
    this.annualReturnsArray = [];
    this.display = false;
  }


}
