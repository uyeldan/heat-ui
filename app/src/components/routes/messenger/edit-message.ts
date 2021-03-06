  /*
 * The MIT License (MIT)
 * Copyright (c) 2016 Heat Ledger Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
@Component({
  selector: 'editMessage',
  inputs: ['publickey'],
  styles: [`
    edit-message .md-button {
      margin: 0px;
      min-width: 46px;
    }
  `],
  template: `
    <div layout="column" flex="noshrink">
      <form hide-gt-xs name="editMessageForm" ng-submit="vm.sendMessage($event)" flex layout="row">
        <textarea ng-model="vm.messageText" flex rows="4"></textarea>
        <md-button type="submit">
          <md-icon md-font-library="material-icons">send</md-icon>
        </md-button>
      </form>
      <textarea hide-xs ng-model="vm.messageText" flex rows="4"
        ng-keypress="vm.onKeyPress($event)" placeholder="Hit ENTER key to send, SHIFT+ENTER for new line"></textarea>
    </div>
  `
})
@Inject('$scope','sendmessage','address')
class EditMessageComponent {

  publickey: string; // @inputs

  private messageText: string;

  constructor(private $scope: angular.IScope,
              private sendmessage: SendmessageService,
              private address: AddressService) {}

  onKeyPress($event: KeyboardEvent) {
    if ($event.keyCode == 13 && !$event.shiftKey) {
      this.sendMessage($event);
    }
  }

  sendMessage($event) {
    var account = heat.crypto.getAccountIdFromPublicKey(this.publickey);
    var accountRS = this.address.numericToRS(account);
    this.sendmessage.
         dialog($event, accountRS, this.publickey, this.messageText).
         send().
         then(() => {
      this.$scope.$evalAsync(() => {
        this.messageText = '';
      });
    });
  }
}